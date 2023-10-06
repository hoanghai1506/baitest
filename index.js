const tinh_tp = 'tinh_tp.json';
const quan_huyen = 'quan_huyen.json';
const phuong_xa = 'xa_phuong.json';

const tinhTpSelect = document.querySelector('.tinh_tp');
const quanHuyenSelect = document.querySelector('.quan_huyen');
const phuongXaSelect = document.querySelector('.xa_phuong');

const addButton = document.querySelector('.btn');
const dataTable = document.getElementById('dataTable');

fetch(tinh_tp)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {

        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                const item = data[key];
                if (item.name && item.slug) {
                    const option = document.createElement('option');
                    option.value = item.code;
                    option.textContent = item.name;
                    tinhTpSelect.appendChild(option);
                }
            }
        }

        // Lắng nghe sự kiện thay đổi trong thẻ select tỉnh/thành phố
        tinhTpSelect.addEventListener('change', () => {
            const selectedTinhTp = tinhTpSelect.value; // Lấy tỉnh/thành phố đã chọn
            // Gọi hàm để lọc và hiển thị danh sách quận/huyện
            filterAndDisplayQuanHuyen(selectedTinhTp);

        });
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });

// Hàm để lọc và hiển thị danh sách quận/huyện dựa trên tỉnh/thành phố đã chọn
function filterAndDisplayQuanHuyen(selectedTinhTp) {
    fetch(quan_huyen)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            while (quanHuyenSelect.firstChild) {
                quanHuyenSelect.removeChild(quanHuyenSelect.firstChild);
            }

            // Lặp qua dữ liệu quận/huyện và thêm các tùy chọn phù hợp vào thẻ select
            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    const item = data[key];
                    // Kiểm tra xem quận/huyện có trường "name", "slug", và "parentCode" phù hợp không
                    if (item.name && item.slug && item.parentCode === selectedTinhTp) {
                        const option = document.createElement('option');
                        option.value = item.code;
                        option.textContent = item.name;
                        quanHuyenSelect.appendChild(option);
                    }
                }
            }
            quanHuyenSelect.addEventListener('change', () => {
                const selectedQuanHuyen = quanHuyenSelect.value;
                // Gọi hàm để lọc và hiển thị danh sách quận/huyện
                filterAndDisplayPhuongXa(selectedQuanHuyen);

            });


        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });

    function filterAndDisplayPhuongXa(selectedQuanHuyen) {

        fetch(phuong_xa)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                while (phuongXaSelect.firstChild) {
                    phuongXaSelect.removeChild(phuongXaSelect.firstChild);
                }

                // Lặp qua dữ liệu phường/xã và thêm các tùy chọn phù hợp vào thẻ select
                for (const key in data) {
                    if (data.hasOwnProperty(key)) {
                        const item = data[key];
                        if (item.name && item.slug && item.parentCode === selectedQuanHuyen) {
                            const option = document.createElement('option');
                            option.value = item.code;
                            option.textContent = item.name;
                            phuongXaSelect.appendChild(option);
                        }
                    }
                }

            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    }

}
addButton.addEventListener('click', async() => {
    const hoTenInput = document.querySelector('input[type="text"][name="hoTen"]');
    const soDienThoaiInput = document.querySelector('input[type="text"][name="soDienThoai"]');
    const emailInput = document.querySelector('input[type="text"][name="email"]');

    const hoTenValue = hoTenInput.value;
    const soDienThoaiValue = soDienThoaiInput.value;
    const emailValue = emailInput.value;
    const selectedTinhTpCode = tinhTpSelect.value;
    const selectedQuanHuyenCode = quanHuyenSelect.value;
    const selectedPhuongXaCode = phuongXaSelect.value;

    // Tìm tên tương ứng từ dữ liệu tỉnh/thành phố
    const selectedTinhTp = await findTinhTpName(selectedTinhTpCode);
    const selectedQuanHuyen = await findQuanHuyenName(selectedQuanHuyenCode);
    const selectedPhuongXa = await findPhuongXaName(selectedPhuongXaCode);
    // Tạo một hàng mới trong bảng
    const newRow = dataTable.insertRow(-1);

    // Tạo các ô cột và đổ dữ liệu vào từ các select đã chọn
    const sttCell = newRow.insertCell(0);
    const hoTenCell = newRow.insertCell(1);
    const soDienThoaiCell = newRow.insertCell(2);
    const emailCell = newRow.insertCell(3);
    const tinhTpCell = newRow.insertCell(4);
    const quanHuyenCell = newRow.insertCell(5);
    const phuongXaCell = newRow.insertCell(6);


    sttCell.textContent = dataTable.rows.length - 1;
    hoTenCell.textContent = hoTenValue;
    soDienThoaiCell.textContent = soDienThoaiValue;
    emailCell.textContent = emailValue;
    tinhTpCell.textContent = selectedTinhTp;
    quanHuyenCell.textContent = selectedQuanHuyen;
    phuongXaCell.textContent = selectedPhuongXa;

    hoTenInput.value = '';
    soDienThoaiInput.value = '';
    emailInput.value = '';
    tinhTpSelect.value = '';
    quanHuyenSelect.value = '';
    phuongXaSelect.value = '';
});


async function findTinhTpName(code) {
    try {
        const response = await fetch(tinh_tp);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                const item = data[key];
                if (item.code === code) {
                    return item.name;
                }
            }
        }
        return '';
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        return '';
    }

}
// find quan huyen name
async function findQuanHuyenName(code) {
    try {
        const response = await fetch(quan_huyen);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                const item = data[key];
                if (item.code === code) {
                    return item.name;
                }
            }
        }
        return '';
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        return '';
    }


}
// find phuong xa name
async function findPhuongXaName(code) {
    try {
        const response = await fetch(phuong_xa);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                const item = data[key];
                if (item.code === code) {
                    return item.name;
                }
            }
        }
        return '';
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        return '';
    }
}
import * as $ from 'jquery';
import { showToast } from './toast';
import { drawGraphics } from './draw';

window.onload = loadTableData;

function submitForm() {
    const xInput = document.getElementById("x") as HTMLInputElement;
    const yButton = document.querySelector('.button-y.selected') as HTMLButtonElement | null;
    const rButton = document.querySelector('.button-radius.selected') as HTMLButtonElement | null;
    if (checkXInput(xInput.value.trim())) {
      const x = parseFloat(xInput.value.trim());
      const y = yButton ? parseFloat(yButton.value) : null;
      const r = rButton ? parseFloat(rButton.value) : null;
      const currentTime = new Date();
      const time = currentTime.toLocaleTimeString();
      if (checkX(x) && checkR(r) && y !== null && r !== null) {
          sendHtml(x, y, r, time);
          drawGraphics(x, y, r);
          showToast("Значения введены корректно, запрос отправлен", "ok");
          return;
      }
    }
    showToast("Пожалуйста, введите значения корректно", "warning");
}

// Event listeners to handle selection of y and r buttons
document.querySelectorAll('.button-y').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelectorAll('.button-y').forEach(btn => btn.classList.remove('selected'));
        button.classList.add('selected');
    });
});

document.querySelectorAll('.button-radius').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelectorAll('.button-radius').forEach(btn => btn.classList.remove('selected'));
        button.classList.add('selected');
    });
});

// Utility functions for validation
function checkXInput(x: string): boolean {
  const floatRegex = /^-?\d+(\.\d+)?$/;
  return floatRegex.test(x);
}

function checkX(x: number): boolean {
    return x >= -5 && x <= 3;
}

function checkR(r: number | null): boolean {
    return r !== null && [1, 1.5, 2, 2.5, 3].includes(r);
}



(window as any).submitForm = submitForm;

function sendHtml(x: number, y: number, r: number, time: string) {
    const url = new URL("/fcgi-bin/web1.jar", window.location.origin);
    url.searchParams.append("x", x.toString());
    url.searchParams.append("y", y.toString());
    url.searchParams.append("r", r.toString());

    $.ajax({
        type: "GET",
        url: url.toString(),
        dataType: "json",
        success: function (response) {
            if (response.x === "null") {
                showToast(response.result, "error");
            } else {
                updateTable(response, time);
                showToast("Ответ успешно получен от сервера", "info");
            }
        },
        error: function (xhr, status, error) {
            showToast(`Ошибка запроса: ${status} - ${error}`, "error");
        }
    });
}


function updateTable(response: any, time: string) {
    const resultTable = document.querySelector("table:nth-of-type(2)") as HTMLTableElement;
    const newRow = resultTable.insertRow(-1);

    newRow.insertCell(0).textContent = time;
    newRow.insertCell(1).textContent = response.workTime;
    newRow.insertCell(2).textContent = response.x;
    newRow.insertCell(3).textContent = response.y;
    newRow.insertCell(4).textContent = response.r;
    newRow.insertCell(5).textContent = response.result;

    saveTableData(time);
}

function saveTableData(time: string) {
    const resultTable = document.querySelector("table:nth-of-type(2)") as HTMLTableElement;
    const rows = resultTable.rows;
    const data: { request: string, workTime: string | null, x: string | null, y: string | null, r: string | null, result: string | null }[] = [];

    for (let i = 1; i < rows.length; i++) {
        const cells = rows[i].cells;
        data.push({
            request: time,
            workTime: cells[1].textContent,
            x: cells[2].textContent,
            y: cells[3].textContent,
            r: cells[4].textContent,
            result: cells[5].textContent
        });
    }

    document.cookie = `tableData=${encodeURIComponent(JSON.stringify(data))}; path=/; max-age=86400`;
}

function loadTableData() {
    const cookies = document.cookie.split('; ').filter(row => row.indexOf('tableData=') === 0);
    const cookieData = cookies.length > 0 ? cookies[0] : null;

    if (cookieData) {
        const jsonData = cookieData.split('=')[1];
        const data = JSON.parse(decodeURIComponent(jsonData));

        const resultTable = document.querySelector("table:nth-of-type(2)") as HTMLTableElement;

        while (resultTable.rows.length > 1) {
            resultTable.deleteRow(1);
        }

        data.forEach((item: { request: string, workTime: string, x: string, y: string, r: string, result: string }) => {
            const newRow = resultTable.insertRow(-1);
            newRow.insertCell(0).textContent = item.request;
            newRow.insertCell(1).textContent = item.workTime;
            newRow.insertCell(2).textContent = item.x;
            newRow.insertCell(3).textContent = item.y;
            newRow.insertCell(4).textContent = item.r;
            newRow.insertCell(5).textContent = item.result;
        });
    } else {
        showToast('Значения таблицы не удалось восстановить.', 'info')
    }
}

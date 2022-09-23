async function setLanguage(lang) {
    location.href = `/Account/SetLanguage?culture=${lang}&returnUrl=${encodeURIComponent(location.href)}`;
}

async function fetchData(method, url, data) {
    try {
        let settings = {
            method: method,
        };
        if (data !== null && data !== undefined && method.toLowerCase() === 'post') {
            settings.body = JSON.stringify(data);
        }
        const fetchResponse = await fetch(`${url}`, settings);
        const result = fetchResponse.json();
        return result;
    } catch (e) {
        return e;
    }
}

$.fn.CustomDataTable = async function (options) {
    const $dataTable = $(this);
    window.addEventListener("resize", function () {
        $dataTable.dataTable().api().responsive.rebuild();
        $dataTable.dataTable().api().responsive.recalc();
        $dataTable.dataTable().api().columns.adjust();
    });

    //https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
    //�Ѻc��� (Destructuring assignment) 
    ({
        fetchColumns: fetchColumns,
        getDataUrl: getDataUrl,
        buttonRender: buttonRender,
        buttonRenderWidth: buttonRenderWidth,
        lang: lang,
    } = options);

    if (buttonRenderWidth === null || buttonRenderWidth === undefined)
        buttonRenderWidth = "150px";

    const sColmns = await fetchColumns;

    let defaultN = 0;
    let theader = ``;
    let columns = [];
    let columnDefs = [];

    // #�Ǹ�
    if (true) {
        theader += `<th class="text-center">#</th>`;
        columns.push({
            "data": null,
        });
        columnDefs.push({
            "targets": defaultN,
            //"width": "50px",
            "searchable": false,
            "orderable": false,
            "render": function (data, type, row, meta) {
                const info = $dataTable.dataTable().api().page.info();
                return '<span style="text-align: center; display:block;">' + (info.page * info.length + meta.row + 1) + '</span>';
            }
        });
        defaultN++;
    }

    // ���s
    if (buttonRender !== null && buttonRender !== undefined) {
        theader += `<th class="text-center"></th>`;
        columns.push({
            "data": null,
        });
        columnDefs.push({
            "targets": defaultN,
            //"width": buttonRenderWidth,
            "searchable": false,
            "orderable": false,
            "render": function (data, type, row, meta) {
                return buttonRender(data, type, row, meta);
            }
        });
        defaultN++
    }

    //���
    for (let i = 0; i < sColmns.data.length; i++) {
        theader += `<th>${sColmns.data[i].displayName}</th>`;
        columns.push({
            "data": sColmns.data[i].name,
        });
        columnDefs.push({
            "targets": i + defaultN,
            "orderable": sColmns.data[i].sortingType === "Enabled",
            "render": function (data, type, row, meta) {
                //�i�b�o�������p�����
                return data;
            }
        });
    }

    //Header �C��
    theader = `<thead class="table-light"><tr>${theader}</tr></thead>`;
    $dataTable.empty().append(theader);

    $dataTable.DataTable({
        "language": {
            "url": `/libs/DataTables/Languages/${lang}.json`,
        },
        "drawCallback": function (settings) {
            $dataTable.find('[data-toggle="tooltip"]').tooltip();
        },
        lengthMenu: [10, 20, 30, 40, 50],
        responsive: true,
        "processing": true,
        "serverSide": true,
        "ajax": {
            "url": getDataUrl,
            "type": "POST",
        },
        "ordering": true,
        "order": [],
        "columnDefs": columnDefs,
        "columns": columns
    });
}
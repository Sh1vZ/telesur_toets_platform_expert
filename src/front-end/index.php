<?php include('./includes/head.php') ?>

<body>
  <?php include('./includes/navbar.php') ?>

  <div class="container-fluid mt-5">
    <div class="row">
      <div class="col-md-6">
        <div id="myGrid" class="ag-theme-alpine"></div>
      </div>
      <div class="col-md-6 hdn" style="display:none">
        <div id="myGrid2" class="ag-theme-alpine"></div>
      </div>
    </div>
  </div>
</body>

<?php include('./includes/end.php') ?>
<script>
  const DateTime = luxon.DateTime;

  const
    filterParams = {
      suppressAndOrCondition: true,
      comparator: (filterLocalDateAtMidnight, cellValue) => {
        var dateAsString = cellValue;
        if (dateAsString == null) return -1;
        var dateParts = dateAsString.split('/');
        console.log(dateParts);
        var cellDate = new Date(
          Number(dateParts[0]),
          Number(dateParts[1]),
          Number(dateParts[2])
        );

        if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
          return 0;
        }

        if (cellDate < filterLocalDateAtMidnight) {
          return -1;
        }

        if (cellDate > filterLocalDateAtMidnight) {
          return 1;
        }
      },
      browserDatePicker: true,
    };

  const columnDefs = [{
      field: "destinationAdres",
      flex: 1,
    },
    {
      field: "destinationIp",
      flex: 1,
    },
    {
      field: "hops",
      flex: 1,
    },
    {
      field: "createdAt",
      flex: 1,
      filter: 'agDateColumnFilter',
      filterParams: filterParams,
    }
  ];
  const columnDefs2 = [{
      field: "hop",
      flex: 1,
    },
    {
      field: "ip",
      flex: 1,
    },
    {
      field: "date",
      flex: 1,
      filter: 'agDateColumnFilter',
      filterParams: filterParams,
    }
  ];

  // let the grid know which columns and what data to use
  const gridOptions = {
    columnDefs: columnDefs,
    rowSelection: 'single',
    onSelectionChanged: () => {
      const selectedData = gridOptions.api.getSelectedRows();
      // console.log('Selection Changed', selectedData);
      getSelectedRowData();
    },
    defaultColDef: {
      filter: true,
      animateRows: true,
      resizable: true,
      sortable: true,
      pagination: true,
    }
  };
  const gridOptions2 = {
    columnDefs: columnDefs2,
    rowSelection: 'single',
    onSelectionChanged: () => {
      const selectedData = gridOptions.api.getSelectedRows();
      // console.log('Selection Changed', selectedData);
      getSelectedRowData();
    },
    defaultColDef: {
      filter: true,
      animateRows: true,
      resizable: true,
      sortable: true,
      pagination: true,
    }
  };



  function getSelectedRowData() {
    let selectedData = gridOptions.api.getSelectedRows();
    document.querySelector('.hdn').style.display = 'block';
    console.log(selectedData);
    fetch(`http://localhost:8080/batch/${selectedData[0].id}`)
      .then((response) => response.json())
      .then((data) => {
        const newData = data.data.map(item => ({
          hop: item.hop,
          ip: item.ip,
          date: DateTime.fromISO(item.date).toFormat("yyyy/MM/dd")
        }))
        gridOptions2.api.setRowData(newData)
      });
  }
  document.addEventListener('DOMContentLoaded', () => {
    const gridDiv = document.querySelector('#myGrid');
    const gridDiv2 = document.querySelector('#myGrid2');

    new agGrid.Grid(gridDiv, gridOptions);
    new agGrid.Grid(gridDiv2, gridOptions2);

    fetch('http://localhost:8080/batch')
      .then((response) => response.json())
      .then((data) => {
        const newData = data.data.map(item => ({
          id: item.id,
          destinationAdres: item.destinationAdres,
          destinationIp: item.destinationIp,
          hops: item.hops,
          createdAt: DateTime.fromISO(item.createdAt).toFormat("yyyy/MM/dd")
        }))
        gridOptions.api.setRowData(newData)
      });
  });
</script>

</html>
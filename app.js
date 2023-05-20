var friends = [];
var genderChart, ageChart;

// Add Friend
function addFriend(name, gender, age) {
  friends.push({ name: name, gender: gender, age: age });
  updateTable();
  updateCharts();
}

// Update Table
function updateTable() {
  var tableBody = document.querySelector('#friend-table tbody');
  tableBody.innerHTML = '';

  for (var i = 0; i < friends.length; i++) {
    var friend = friends[i];

    var row = document.createElement('tr');
    row.innerHTML = '<td>' + friend.name + '</td><td>' + (friend.gender === 'L' ? 'Laki-laki' : 'Perempuan') + '</td><td>' + friend.age + '</td>';

    tableBody.appendChild(row);
  }
}

// Update Charts
function updateCharts() {
  var maleCount = 0;
  var femaleCount = 0;
  var ageBelow20Count = 0;
  var ageAbove20Count = 0;

  for (var i = 0; i < friends.length; i++) {
    var friend = friends[i];

    if (friend.gender === 'L') {
      maleCount++;
    } else {
      femaleCount++;
    }

    if (friend.age <= 19) {
      ageBelow20Count++;
    } else {
      ageAbove20Count++;
    }
  }

  // Destroy previous charts
  if (genderChart) {
    genderChart.destroy();
  }
  if (ageChart) {
    ageChart.destroy();
  }

  var genderChartCanvas = document.getElementById('gender-chart');
  var ageChartCanvas = document.getElementById('age-chart');

  var genderData = {
    datasets: [
      {
        data: [maleCount, femaleCount],
        backgroundColor: ['#93ccf5', '#db70e9'],
      },
    ],
    labels: ['Laki-laki', 'Perempuan'],
  };

  var ageData = {
    datasets: [
      {
        data: [ageBelow20Count, ageAbove20Count],
        backgroundColor: ['#93ccf5', '#db70e9'],
      },
    ],
    labels: ['19 Tahun ke Bawah', '20 Tahun ke Atas'],
  };

  // Gender Chart
  genderChart = new Chart(genderChartCanvas, {
    type: 'pie',
    data: genderData,
    options: {
      plugins: {
        datalabels: {
          formatter: function (value, context) {
            return value;
          },
        },
      },
    },
  });

  // Age Chart
  ageChart = new Chart(ageChartCanvas, {
    type: 'pie',
    data: ageData,
    options: {
      plugins: {
        datalabels: {
          formatter: function (value, context) {
            return value;
          },
        },
      },
    },
  });
}

// Function to download the report as a PDF
function downloadReport() {
  var doc = new jsPDF();

  // Add the table
  var tableElement = document.getElementById('friend-table');
  doc.autoTable({
    html: tableElement,
    startY: 20,
    styles: { fontSize: 12 },
    headStyles: { fillColor: [41, 128, 185] },
    columnStyles: { 0: { cellWidth: 50 }, 1: { cellWidth: 50 }, 2: { cellWidth: 30 } },
    head: [['Name', 'Gender', 'Age']],
  });

  // Add the gender chart
  var genderChartCanvas = document.getElementById('gender-chart');
  var genderChartImage = genderChartCanvas.toDataURL('image/png');
  doc.addImage(genderChartImage, 'PNG', 10, doc.autoTable.previous.finalY + 10, 80, 80);

  // Add the age chart
  var ageChartCanvas = document.getElementById('age-chart');
  var ageChartImage = ageChartCanvas.toDataURL('image/png');
  doc.addImage(ageChartImage, 'PNG', 100, doc.autoTable.previous.finalY + 10, 80, 80);

  // Save the PDF file
  doc.save('laporan_teman.pdf');
}



// Event listener for the friend form submission
document.getElementById('friend-form').addEventListener('submit', function(e) {
  e.preventDefault();
  var name = document.getElementById('name').value;
  var gender = document.getElementById('gender').value;
  var age = parseInt(document.getElementById('age').value);

  addFriend(name, gender, age);

  document.getElementById('name').value = '';
  document.getElementById('gender').value = 'L';
  document.getElementById('age').value = '';
});

// Event listener for the download button click
document.getElementById('download-btn').addEventListener('click', function() {
  downloadReport();
});

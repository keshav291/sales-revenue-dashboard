let salesData = [
    {
        product: "Laptop",
        category: "Electronics",
        sales: 25,
        revenue: 125000,
        month: "January"
    },
    {
        product: "Mobile",
        category: "Electronics",
        sales: 40,
        revenue: 80000,
        month: "February"
    },
    {
        product: "T-Shirt",
        category: "Clothing",
        sales: 60,
        revenue: 30000,
        month: "March"
    },
    {
        product: "Shoes",
        category: "Clothing",
        sales: 35,
        revenue: 52500,
        month: "April"
    },
    {
        product: "Chair",
        category: "Home",
        sales: 20,
        revenue: 20000,
        month: "May"
    },
    {
        product: "Table",
        category: "Home",
        sales: 15,
        revenue: 30000,
        month: "June"
    }
];

const categoryFilter = document.getElementById("categoryFilter");

function updateDashboard() {

    const selectedCategory = categoryFilter.value;

    let filteredData;

    if (selectedCategory === "All") {
        filteredData = salesData;
    } else {
        filteredData = salesData.filter(
            item => item.category === selectedCategory
        );
    }

    // Total Sales
    const totalSales = filteredData.reduce(
        (sum, item) => sum + item.sales,
        0
    );

    document.getElementById("totalSales").textContent = totalSales;

    // Total Revenue
    const totalRevenue = filteredData.reduce(
        (sum, item) => sum + item.revenue,
        0
    );

    document.getElementById("totalRevenue").textContent =
        "₹" + totalRevenue.toLocaleString("en-IN");

    // Total Products
    document.getElementById("totalProducts").textContent =
        filteredData.length;

    // Top Product
    if (filteredData.length > 0) {

        const topProduct = [...filteredData].sort(
            (a, b) => b.revenue - a.revenue
        )[0];

        document.getElementById("topProduct").textContent =
            topProduct.product;

    } else {

        document.getElementById("topProduct").textContent = "-";
    }

    // Product Table
    const table = document.getElementById("productTable");

    table.innerHTML = "";

    filteredData.forEach(item => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${item.product}</td>
            <td>${item.category}</td>
            <td>${item.sales}</td>
            <td>₹${item.revenue.toLocaleString("en-IN")}</td>
        `;

        table.appendChild(row);
    });

    // Revenue Chart
    createChart(filteredData);
}

function createChart(data) {

    const chart = document.getElementById("revenueChart");

    chart.innerHTML = "";

    if (data.length === 0) {
        chart.textContent = "No data available";
        return;
    }

    const maxRevenue = Math.max(
        ...data.map(item => item.revenue)
    );

    data.forEach(item => {

        const bar = document.createElement("div");

        bar.className = "bar";

        const height =
            (item.revenue / maxRevenue) * 220;

        bar.style.height = height + "px";

        bar.title =
            item.month + " - ₹" +
            item.revenue.toLocaleString("en-IN");

        bar.textContent = item.month.substring(0, 3);

        chart.appendChild(bar);
    });
}

categoryFilter.addEventListener(
    "change",
    updateDashboard
);

updateDashboard();
const csvFile = document.getElementById("csvFile");

csvFile.addEventListener("change", function () {

    const file = this.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (event) {

        const lines = event.target.result.trim().split("\n");

        const headers = lines[0].split(",").map(h => h.trim());

        const importedData = lines.slice(1).map(line => {

            const values = line.split(",").map(v => v.trim());

            const row = {};

            headers.forEach((header, index) => {
                row[header] = values[index];
            });

            return {
                product: row.product,
                category: row.category,
                sales: Number(row.sales),
                revenue: Number(row.revenue),
                month: row.month
            };
        });

        salesData = importedData;

        updateDashboard();

        alert("CSV data imported successfully!");
    };

    reader.readAsText(file);
});
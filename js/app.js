const devices = [
    {
        id: 1,
        name: "Amina's Laptop",
        type: "Laptop",
        status: "Trusted",
        ip: "192.168.1.10",
        access: "Full"
    },

    {
        id: 2,
        name: "Kevin's Phone",
        type: "Phone",
        status: "Trusted",
        ip: "192.168.1.11",
        access: "Full"
    },

    {
        id: 3,
        name: "Office Printer",
        type: "Printer",
        status: "Trusted",
        ip: "192.168.1.12",
        access: "Full"
    },

    {
        id: 4,
        name: "Guest Laptop",
        type: "Laptop",
        status: "Guest",
        ip: "192.168.1.20",
        access: "Restricted"
    },

    {
        id: 5,
        name: "Unknown Device",
        type: "Unknown",
        status: "Unknown",
        ip: "192.168.1.27",
        access: "Restricted"
    }
];

const deviceTableBody = document.getElementById("device-table-body");

function renderDevices() {
    deviceTableBody.innerHTML = "";

    devices.forEach(function(device) {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${device.name}</td>
            <td>${device.type}</td>
            <td>
                <span class="device-status ${device.status.toLowerCase()}">
                    <span class="status-dot"></span>
                    ${device.status}
                </span>
            </td>
            <td>${device.ip}</td>
            <td>
                <a href="device.html?id=${device.id}" aria-label="View ${device.name}">
                    <i class="fa fa-chevron-right" aria-hidden="true"></i>
                </a>
            </td>
        `;
        deviceTableBody.appendChild(row);
    });
}

renderDevices();
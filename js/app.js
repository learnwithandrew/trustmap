const defaultDevices = [
    {
        id: 1,
        name: "Amina's Laptop",
        type: "Laptop",
        status: "Trusted",
        ip: "192.168.1.10",
        mac: "A4:C3:F0:12:8B:01",
        access: "Full"
    },

    {
        id: 2,
        name: "Kevin's Phone",
        type: "Phone",
        status: "Trusted",
        ip: "192.168.1.11",
        mac: "B8:27:EB:45:91:02",
        access: "Full"
    },

    {
        id: 3,
        name: "Office Printer",
        type: "Printer",
        status: "Trusted",
        ip: "192.168.1.12",
        mac: "C2:44:6D:73:AC:03",
        access: "Full"
    },

    {
        id: 4,
        name: "Guest Laptop",
        type: "Laptop",
        status: "Guest",
        ip: "192.168.1.20",
        mac: "D6:11:9A:82:4F:04",
        access: "Restricted"
    },

    {
        id: 5,
        name: "Unknown Device",
        type: "Unknown",
        status: "Unknown",
        ip: "192.168.1.27",
        mac: "AA:BB:CC:DD:EE:FF",
        access: "Restricted"
    }
];

const savedDevices = localStorage.getItem("trustmapDevices");
const devices = savedDevices ? JSON.parse(savedDevices) : defaultDevices;

const deviceTableBody = document.getElementById("device-table-body");

function renderDevices(deviceList = devices) {
    deviceTableBody.innerHTML = "";

    deviceList.forEach(function(device) {
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

const params = new URLSearchParams(window.location.search);
const deviceId = Number(params.get("id"));

const selectedDevice = devices.find(function(device) {
    return device.id === deviceId;
});


function renderDeviceDetails(device) {
    const deviceName = document.getElementById("device-name");

    if (!deviceName) {
        return;
    }

    document.getElementById("device-name").textContent = device.name;
    document.getElementById("device-detail-name").textContent = device.name;
    document.getElementById("device-type").textContent = device.type;
    document.getElementById("device-ip").textContent = device.ip;
    document.getElementById("device-mac").textContent = device.mac;
    document.getElementById("device-access").textContent = device.access;


    // Device-Detail-Heading status
    const headingStatus = document.getElementById("device-heading-status");
    const headingStatusText = document.getElementById("device-heading-status-text");

    headingStatusText.textContent = device.status;
    headingStatus.className = `device-status ${device.status.toLowerCase()}`;

    // Device-Detail body status
    const detailStatus = document.getElementById("device-detail-status");
    const detailStatusText = document.getElementById("device-detail-status-text");

    detailStatusText.textContent = device.status;
    detailStatus.className = `device-status ${device.status.toLowerCase()}`;
}

if (selectedDevice) {
    renderDeviceDetails(selectedDevice);
}

const trustDeviceButton = document.getElementById("trust-device-button");
if (trustDeviceButton && selectedDevice) {
    trustDeviceButton.addEventListener("click", function() {
        selectedDevice.status = "Trusted";
        selectedDevice.access = "Full";
        
        localStorage.setItem(
            "trustmapDevices",
            JSON.stringify(devices)
        );

        window.location.href = "index.html";
    });
}

function updateDashboardCounts() {
    const deviceCount = devices.length;

    const trustedCount = devices.filter(function(device) {
        return device.status === "Trusted";
    }).length;

    const guestCount = devices.filter(function(device) {
        return device.status === "Guest";
    }).length;

    const attentionCount = devices.filter(function(device) {
        return device.status === "Unknown";
    }).length;

    document.getElementById("device-count").textContent = deviceCount;
    document.getElementById("trusted-count").textContent = trustedCount;
    document.getElementById("guest-count").textContent = guestCount;
    document.getElementById("attention-count").textContent = attentionCount;
}

function updateNetworkAlert() {
    const networkAlert = document.getElementById("network-alert");

    if (!networkAlert) {
        return;
    }

    const unknownDevices = devices.filter(function(device) {
        return device.status === "Unknown";
    });

    if (unknownDevices.length > 0) {
        networkAlert.className = "attention-alert";
        networkAlert.innerHTML = `
            <span class="alert-icon" aria-hidden="true">⚠</span>
            <div class="alert-message">
                <strong>
                    ${unknownDevices.length} device needs attention
                </strong>
                <p> Review the unknown device below.</p>
            </div>

            <a href="device.html?id=${unknownDevices[0].id}" class="alert-action" aria-label="Review unknown device">
                <i class="fa fa-chevron-right" aria-hidden="true"></i>
            </a>
        `;

    } else {
        networkAlert.className = "attention-alert all-clear-alert";
        networkAlert.innerHTML = `
            <span class="alert-icon" aria-hidden="true">
                <i class="fa fa-check" aria-hidden="true"></i>
            </span>
            <div class="alert-message">
                <strong>All clear</strong>
                <p>All connected devices are trusted.</p>
            </div>
        `;
    }
}

if (deviceTableBody) {
    renderDevices();
    updateDashboardCounts();
    updateNetworkAlert();
}


const deviceSearch = document.getElementById("device-search");
const deviceFilter = document.getElementById("device-filter");

function applyDeviceFilters() {

    const searchTerm = deviceSearch.value.toLowerCase();
    const selectedStatus = deviceFilter.value;

    const filteredDevices = devices.filter(function(device) {
        const matchesSearch = device.name.toLowerCase().includes(searchTerm);
        const matchesStatus = selectedStatus === "all" || device.status.toLowerCase() === selectedStatus;
        return matchesSearch && matchesStatus;
    });

    renderDevices(filteredDevices);
}

if (deviceSearch && deviceFilter) {
    deviceSearch.addEventListener("input", applyDeviceFilters);
    deviceFilter.addEventListener("change", applyDeviceFilters);
}
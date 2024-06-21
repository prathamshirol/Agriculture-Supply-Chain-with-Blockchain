// Replace with your contract ABI and address
const contractABI = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_farmerAddress",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			}
		],
		"name": "addFarmer",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_productId",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_quantity",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_price",
				"type": "uint256"
			}
		],
		"name": "addProduct",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "farmerAddress",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "name",
				"type": "string"
			}
		],
		"name": "FarmerAdded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "productId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "lostQuantity",
				"type": "uint256"
			}
		],
		"name": "PostHarvestLossRecorded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "productId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "quantity",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "farmerAddress",
				"type": "address"
			}
		],
		"name": "ProductAdded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "productId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "quantity",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "valueReceived",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "buyer",
				"type": "address"
			}
		],
		"name": "ProductSold",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_productId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_lostQuantity",
				"type": "uint256"
			}
		],
		"name": "recordPostHarvestLoss",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_productId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_quantity",
				"type": "uint256"
			}
		],
		"name": "sellProduct",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "farmers",
		"outputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "farmerAddress",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "isRegistered",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "products",
		"outputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "quantity",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "farmerAddress",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "isAvailable",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];
const contractAddress = '0x26a77595Aa80350af52A14116E197E53b8B92601';

// Initialize Web3 instance
const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545');

// Initialize contract instance
const contract = new web3.eth.Contract(contractABI, contractAddress);

// Connect to MetaMask
async function connectToMetaMask() {
    if (window.ethereum) {
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            console.log('Connected to MetaMask');
        } catch (error) {
            console.error('Error connecting to MetaMask:', error);
        }
    } else {
        console.error('MetaMask is not installed');
    }
}

// Add Farmer
async function addFarmer() {
    const farmerName = document.getElementById('farmerName').value;
    const farmerAddress = document.getElementById('farmerAddress').value;

    try {
        await contract.methods.addFarmer(farmerAddress, farmerName).send({ from: window.ethereum.selectedAddress });
        console.log('Farmer added successfully');
    } catch (error) {
        console.error('Error adding farmer:', error);
    }
}

// Add Product
async function addProduct() {
    const productId = document.getElementById('productId').value;
    const productName = document.getElementById('productName').value;
    const productQuantity = document.getElementById('productQuantity').value;
    const productPrice = document.getElementById('productPrice').value;

    try {
        await contract.methods.addProduct(productId, productName, productQuantity, productPrice).send({ from: window.ethereum.selectedAddress });
        console.log('Product added successfully');
    } catch (error) {
        console.error('Error adding product:', error);
    }
}

// Sell Product
async function sellProduct() {
    const productId = document.getElementById('sellProductId').value;
    const sellQuantity = document.getElementById('sellQuantity').value;

    try {
        await contract.methods.sellProduct(productId, sellQuantity).send({ from: window.ethereum.selectedAddress, value: web3.utils.toWei('1', 'ether') });
        console.log('Product sold successfully');
    } catch (error) {
        console.error('Error selling product:', error);
    }
}

// Record Post-Harvest Loss
async function recordLoss() {
    const productId = document.getElementById('lossProductId').value;
    const lostQuantity = document.getElementById('lostQuantity').value;

    try {
        await contract.methods.recordPostHarvestLoss(productId, lostQuantity).send({ from: window.ethereum.selectedAddress });
        console.log('Post-harvest loss recorded successfully');
    } catch (error) {
        console.error('Error recording post-harvest loss:', error);
    }
}

// Connect to MetaMask on page load
window.onload = connectToMetaMask;
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AgricultureSupplyChain {
    address public owner;

    struct Farmer {
        string name;
        address farmerAddress;
        bool isRegistered;
    }

    struct Product {
        string name;
        uint quantity;
        uint price;
        address farmerAddress;
        bool isAvailable;
    }

    mapping(address => Farmer) public farmers;
    mapping(uint => Product) public products;

    event FarmerAdded(address indexed farmerAddress, string name);
    event ProductAdded(uint indexed productId, string name, uint quantity, uint price, address indexed farmerAddress);
    event ProductSold(uint indexed productId, uint quantity, uint valueReceived, address indexed buyer);
    event PostHarvestLossRecorded(uint indexed productId, uint lostQuantity);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    modifier onlyRegisteredFarmer() {
        require(farmers[msg.sender].isRegistered, "Only registered farmers can perform this action");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function addFarmer(address _farmerAddress, string memory _name) public onlyOwner {
        require(!farmers[_farmerAddress].isRegistered, "Farmer is already registered");
        farmers[_farmerAddress] = Farmer({
            name: _name,
            farmerAddress: _farmerAddress,
            isRegistered: true
        });
        emit FarmerAdded(_farmerAddress, _name);
    }

    function addProduct(uint _productId, string memory _name, uint _quantity, uint _price) public onlyRegisteredFarmer {
        require(_quantity > 0, "Quantity must be greater than zero");
        require(_price > 0, "Price must be greater than zero");
        require(products[_productId].farmerAddress == address(0), "Product ID already exists");

        products[_productId] = Product({
            name: _name,
            quantity: _quantity,
            price: _price,
            farmerAddress: msg.sender,
            isAvailable: true
        });
        emit ProductAdded(_productId, _name, _quantity, _price, msg.sender);
    }

    function sellProduct(uint _productId, uint _quantity) public payable {
        Product storage product = products[_productId];
        require(product.isAvailable, "Product is not available or has been sold out");
        require(product.quantity >= _quantity, "Insufficient product quantity");

        uint valueReceived = msg.value;
        uint maxQuantityToBuy = valueReceived / product.price;

        if (maxQuantityToBuy >= _quantity) {
            product.quantity -= _quantity;
            payable(product.farmerAddress).transfer(product.price * _quantity);
            emit ProductSold(_productId, _quantity, valueReceived, msg.sender);
        } else {
            product.quantity -= maxQuantityToBuy;
            payable(product.farmerAddress).transfer(valueReceived);
            emit ProductSold(_productId, maxQuantityToBuy, valueReceived, msg.sender);
        }

        if (product.quantity == 0) {
            product.isAvailable = false;
        }
    }

    function recordPostHarvestLoss(uint _productId, uint _lostQuantity) public onlyRegisteredFarmer {
        Product storage product = products[_productId];
        require(product.farmerAddress == msg.sender, "You can only record loss for your own products");
        require(product.quantity > 0, "Product is not available");
        
        // Adjust lost quantity if it exceeds available quantity
        if (_lostQuantity >= product.quantity) {
            _lostQuantity = product.quantity;
            product.isAvailable = false;
        }

        product.quantity -= _lostQuantity;
        emit PostHarvestLossRecorded(_productId, _lostQuantity);
    }
}
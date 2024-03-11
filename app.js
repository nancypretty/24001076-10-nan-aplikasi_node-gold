const express = require('express');
const app = express();
const {User, Orders, Items} = require("./models");

app.use(express.json());

// Register pelanggan baru
async function register(req, res) {
    const {username, password, email} = req.body;
    const findUser = await User.findOne({
        where : {username : username}
    });
    if (findUser){
        return res.status(403).send("Username already exist!")
    } else {
        const user = new User;
        user.username = username;
        user.password = password;
        user.email = email;

        await user.save();
        res.sendStatus(201)
    }
};

// Login pelanggan
async function login(req, res) {
    const {username, password} = req.body;
    const findUser = await User.findOne({
        where : {
            username : username,
            password : password,
        }
    });
    if (findUser) {
        return res.send("Login Success");
    } else {
        return res.send("Wrong username / password!");
    }
};

app.post("/register", register);
app.route("/login")
.get(async (req, res) => {
    const users = await User.findAll();
    return res.json({users});
})
.post(login);

// Menamppilkan data item
async function postItem(req, res) {
    const {name, stock, price} = req.body;

    const item = new Items;
    item.name = name;
    item.price = price;
    item.stock = stock;

    await item.save();
    console.log(item);
    res.sendStatus(201)
}

// Menghapus data item
async function deleteItem (req, res) {
    const itemId = req.params.itemId;

    const findItem = await Items.findByPk(itemId);
    await findItem.destroy();
    res.sendStatus(200);
}

app.route("/items")
.get(async (req, res) => {
    const items = await Items.findAll();
    return res.json({items})}
    )
.post(postItem);
app.delete("/items/:itemId", deleteItem);


// Membuat pesanan baru 
async function createOrder(req, res) {
    const {username, item_name, qty} = req.body;
    const findUser = await User.findOne({
        where : {username : username}
    });
    if (findUser) {
        const findItem = await Items.findOne({
            where : {name : item_name}
        })
        if(findItem) {
            const order = new Orders;
            order.user_id = findUser.id;
            order.item_id = findItem.id;
            order.bill = findItem.price*qty;
            order.status = "Pending"
            
            await order.save();
            findItem.stock -= qty;
            await findItem.save();
            res.status(201).json({
                message : "Order created!",
                your_order : order,
                detail : findItem 
            })
        } else {
            res.status(403).send("Item not found. Please type correct item_name to create orders!");
        }
    } else {
        res.status(403).send("User not found. Please make sure data is correct to create orders!")
    }
}

// Memperbaharui status pesanan
async function updateStatus(req, res) {
    const orderId = req.params.orderId;
    const findOrder = await Orders.findByPk(orderId);
    if (findOrder) {
        findOrder.status = "Completed";
        await findOrder.save()
        res.status(200).send({
            message : "Status updated!",
            your_order : findOrder});
    } else {
        res.sendStatus(204);
    }
}

// Menghapus pesanan apabila status belum dikirim
async function cancelOrder(req, res) {
    const orderId = req.params.orderId;
    const findOrder = await Orders.findByPk(orderId);
    if (findOrder.status == "Pending") {
        await findOrder.destroy()
        res.sendStatus(200);
    } else {
        res.status(403).send("Not eligible for cancellation");
    }
}

app.route("/orders")
.get(async (req, res) => {
    const order = await Orders.findAll();
    return res.json({order})
})
.post(createOrder);
app.patch("/orders/:orderId", updateStatus);
app.delete("/orders/:orderId", cancelOrder);


// SERVER
app.use((err, req, res, next) => {
    console.error(err)
    res.status(500).send("Opps something error!")
})

app.listen("8080", () => {
console.log("Sever is running on port 8080.")
});
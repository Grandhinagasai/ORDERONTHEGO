const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "..", ".env") });

const User = require("../models/User");
const Restaurant = require("../models/Restaurant");
const Food = require("../models/Food");
const Admin = require("../models/Admin");

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected for seeding...");

        await User.deleteMany({});
        await Restaurant.deleteMany({});
        await Food.deleteMany({});
        await Admin.deleteMany({});

        const adminUser = await User.create({
            username: "admin",
            email: "admin@nsfoods.com",
            password: "admin123",
            userType: "admin",
            approval: true,
        });

        const restaurantUser1 = await User.create({
            username: "TasteOfIndia",
            email: "tasteofindia@nsfoods.com",
            password: "restaurant123",
            userType: "restaurant",
            approval: true,
        });

        const restaurantUser2 = await User.create({
            username: "PizzaPalace",
            email: "pizzapalace@nsfoods.com",
            password: "restaurant123",
            userType: "restaurant",
            approval: true,
        });

        const restaurantUser3 = await User.create({
            username: "BurgerBarn",
            email: "burgerbarn@nsfoods.com",
            password: "restaurant123",
            userType: "restaurant",
            approval: true,
        });

        const customerUser = await User.create({
            username: "lisa",
            email: "lisa@example.com",
            password: "customer123",
            userType: "customer",
            approval: true,
        });

        console.log("Users seeded.");

        const restaurant1 = await Restaurant.create({
            ownerId: restaurantUser1._id,
            title: "Taste of India",
            address: "123 Spice Lane, Food District",
            mainImg: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
            menu: ["Soups", "Main Course", "Breads", "Desserts", "Beverages"],
        });

        const restaurant2 = await Restaurant.create({
            ownerId: restaurantUser2._id,
            title: "Pizza Palace",
            address: "456 Cheese Street, Downtown",
            mainImg: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800",
            menu: ["Pizza", "Snacks", "Beverages", "Desserts"],
        });

        const restaurant3 = await Restaurant.create({
            ownerId: restaurantUser3._id,
            title: "Burger Barn",
            address: "789 Grill Road, Suburbs",
            mainImg: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=800",
            menu: ["Burgers", "Snacks", "Beverages", "Salads"],
        });

        console.log("Restaurants seeded.");

        const foods = [
            {
                title: "Chicken Noodle Soup",
                description: "A comforting bowl of rich chicken broth with tender noodles, shredded chicken, carrots, and celery. Perfect for late-night cravings.",
                mainImg: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600",
                menuType: "non-veg",
                category: "Soups",
                restaurant: restaurant1._id,
                price: 199,
                discount: 10,
                rating: 4.5,
            },
            {
                title: "Tomato Basil Soup",
                description: "Creamy tomato soup infused with fresh basil, garlic, and a hint of cream. Served with croutons.",
                mainImg: "https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=600",
                menuType: "veg",
                category: "Soups",
                restaurant: restaurant1._id,
                price: 149,
                discount: 5,
                rating: 4.3,
            },
            {
                title: "Garlic Bread",
                description: "Crispy bread topped with garlic butter, herbs, and melted mozzarella cheese. Golden and irresistible.",
                mainImg: "https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?w=600",
                menuType: "veg",
                category: "Breads",
                restaurant: restaurant1._id,
                price: 129,
                discount: 0,
                rating: 4.4,
            },
            {
                title: "Butter Naan",
                description: "Soft, fluffy Indian bread baked in a tandoor and brushed with melted butter. A classic accompaniment.",
                mainImg: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600",
                menuType: "veg",
                category: "Breads",
                restaurant: restaurant1._id,
                price: 49,
                discount: 0,
                rating: 4.6,
            },
            {
                title: "Butter Chicken",
                description: "Tender chicken pieces simmered in a rich, creamy tomato-butter sauce with aromatic spices. A beloved Indian classic.",
                mainImg: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600",
                menuType: "non-veg",
                category: "Main Course",
                restaurant: restaurant1._id,
                price: 349,
                discount: 15,
                rating: 4.8,
            },
            {
                title: "Paneer Tikka Masala",
                description: "Grilled paneer cubes in a spiced, smoky tomato gravy. Rich, flavorful, and perfect with naan.",
                mainImg: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600",
                menuType: "veg",
                category: "Main Course",
                restaurant: restaurant1._id,
                price: 299,
                discount: 10,
                rating: 4.7,
            },
            {
                title: "Chicken Biryani",
                description: "Fragrant basmati rice layered with spiced chicken, saffron, and caramelized onions. Served with raita.",
                mainImg: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600",
                menuType: "non-veg",
                category: "Biryani",
                restaurant: restaurant1._id,
                price: 299,
                discount: 20,
                rating: 4.9,
            },
            {
                title: "Veg Biryani",
                description: "Aromatic basmati rice cooked with mixed vegetables, mint, and traditional biryani spices.",
                mainImg: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600",
                menuType: "veg",
                category: "Biryani",
                restaurant: restaurant1._id,
                price: 249,
                discount: 10,
                rating: 4.4,
            },
            {
                title: "Margherita Pizza",
                description: "Classic Italian pizza with San Marzano tomato sauce, fresh mozzarella, basil, and extra virgin olive oil.",
                mainImg: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600",
                menuType: "veg",
                category: "Pizza",
                restaurant: restaurant2._id,
                price: 299,
                discount: 10,
                rating: 4.5,
            },
            {
                title: "Pepperoni Pizza",
                description: "Loaded with spicy pepperoni, gooey mozzarella cheese, and zesty marinara sauce on a crispy crust.",
                mainImg: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600",
                menuType: "non-veg",
                category: "Pizza",
                restaurant: restaurant2._id,
                price: 399,
                discount: 15,
                rating: 4.7,
            },
            {
                title: "BBQ Chicken Pizza",
                description: "Smoky BBQ sauce base topped with grilled chicken, red onions, cilantro, and three-cheese blend.",
                mainImg: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600",
                menuType: "non-veg",
                category: "Pizza",
                restaurant: restaurant2._id,
                price: 449,
                discount: 10,
                rating: 4.6,
            },
            {
                title: "Classic Cheeseburger",
                description: "Juicy beef patty with melted cheddar, lettuce, tomato, pickles, and special sauce on a toasted bun.",
                mainImg: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600",
                menuType: "non-veg",
                category: "Burgers",
                restaurant: restaurant3._id,
                price: 249,
                discount: 10,
                rating: 4.6,
            },
            {
                title: "Veggie Supreme Burger",
                description: "Crispy veggie patty with avocado, roasted peppers, lettuce, and chipotle mayo. Hearty and satisfying.",
                mainImg: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=600",
                menuType: "veg",
                category: "Burgers",
                restaurant: restaurant3._id,
                price: 229,
                discount: 5,
                rating: 4.3,
            },
            {
                title: "Crispy French Fries",
                description: "Golden, crispy fries seasoned with sea salt and served with ketchup and garlic aioli.",
                mainImg: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600",
                menuType: "veg",
                category: "Snacks",
                restaurant: restaurant3._id,
                price: 99,
                discount: 0,
                rating: 4.2,
            },
            {
                title: "Chicken Wings",
                description: "Crispy fried chicken wings tossed in your choice of Buffalo, BBQ, or Honey Mustard sauce.",
                mainImg: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=600",
                menuType: "non-veg",
                category: "Snacks",
                restaurant: restaurant3._id,
                price: 279,
                discount: 10,
                rating: 4.5,
            },
            {
                title: "Caesar Salad",
                description: "Crisp romaine lettuce with parmesan, croutons, and creamy Caesar dressing. Fresh and light.",
                mainImg: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=600",
                menuType: "veg",
                category: "Salads",
                restaurant: restaurant3._id,
                price: 179,
                discount: 5,
                rating: 4.1,
            },
            {
                title: "Gulab Jamun",
                description: "Soft, melt-in-your-mouth milk dumplings soaked in rose-cardamom sugar syrup. A sweet Indian classic.",
                mainImg: "https://images.unsplash.com/photo-1666190050267-5765bf060c57?w=600",
                menuType: "veg",
                category: "Desserts",
                restaurant: restaurant1._id,
                price: 99,
                discount: 0,
                rating: 4.7,
            },
            {
                title: "Chocolate Lava Cake",
                description: "Warm, decadent chocolate cake with a molten center, served with vanilla ice cream.",
                mainImg: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=600",
                menuType: "veg",
                category: "Desserts",
                restaurant: restaurant2._id,
                price: 199,
                discount: 10,
                rating: 4.8,
            },
            {
                title: "Mango Lassi",
                description: "Creamy yogurt drink blended with ripe mangoes and a touch of cardamom. Cool and refreshing.",
                mainImg: "https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=600",
                menuType: "veg",
                category: "Beverages",
                restaurant: restaurant1._id,
                price: 89,
                discount: 0,
                rating: 4.4,
            },
            {
                title: "Cold Coffee",
                description: "Rich, creamy cold coffee blended with ice cream and topped with whipped cream and cocoa.",
                mainImg: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600",
                menuType: "veg",
                category: "Beverages",
                restaurant: restaurant2._id,
                price: 129,
                discount: 5,
                rating: 4.3,
            },
        ];

        await Food.insertMany(foods);
        console.log("Food items seeded.");

        await Admin.create({
            banner: [
                "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200",
                "https://images.unsplash.com/photo-1493770348161-369560ae357d?w=1200",
                "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=1200",
            ],
            categories: [
                "Soups", "Breads", "Main Course", "Desserts", "Beverages",
                "Snacks", "Salads", "Biryani", "Pizza", "Burgers",
            ],
            promotedRestaurants: [restaurant1._id, restaurant2._id, restaurant3._id],
        });
        console.log("Admin config seeded.");

        console.log("\n--- Seed Complete ---");
        console.log("Admin:      admin@nsfoods.com / admin123");
        console.log("Restaurant: tasteofindia@nsfoods.com / restaurant123");
        console.log("Restaurant: pizzapalace@nsfoods.com / restaurant123");
        console.log("Restaurant: burgerbarn@nsfoods.com / restaurant123");
        console.log("Customer:   lisa@example.com / customer123");

        process.exit(0);
    } catch (error) {
        console.error("Seeding error:", error);
        process.exit(1);
    }
};

seedDB();

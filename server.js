const app = require("./src/app");
const db = require("./src/models");
const ExpressError = require("./src/utils/expressError");


const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        await db.sequelize.sync({ alter: true });
        console.log("Database synced");
        app.listen(PORT, () => {

            console.log(`Server is running on Port : ${PORT}`);

        });
    } catch (error) {
        console.error("Error syncing database:", error);
        throw new ExpressError(`Failed to sync database: ${error.message}`, 500);
    }
}
startServer();
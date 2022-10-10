import App from "@/app";
import AuthRoute from "@routes/auth.route";
import IndexRoute from "@routes/index.route";
import UsersRoute from "@routes/users.route";
import validateEnv from "@utils/validateEnv";
import TransactionRoute from "@routes/transactions.route";
import AccountsRoute from "@routes/accounts.route";

validateEnv();

const app = new App([new IndexRoute(), new UsersRoute(), new AuthRoute(), new TransactionRoute(), new AccountsRoute()]);

app.listen();

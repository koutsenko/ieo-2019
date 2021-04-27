let main;

switch (process.env.REACT_APP_WHICH_APP) {
  case "admin":
    main = require("./admin").default;
    break;

  case "client":
    main = require("./client").default;
    break;

  default:
    main = () => {
      console.log("?");
    };
    break;
}

main();

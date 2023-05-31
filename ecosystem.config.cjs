/** @format */

module.exports = {
    apps: [
        {
            name: "food-terror",
            script: "./src/main.js",
            instance_var: "INSTANCE_ID",
            env_dev: {
                NODE_ENV: "development"
            },
            env_stg: {
                NODE_ENV: "staging"
            },
            env_prod: {
                NODE_ENV: "production"
            },
            time: true,
            watch: ["./src/"],
            ignore_watch: ["./src/channel-target.json"],
        },
    ],
};

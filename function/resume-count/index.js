const { TableClient } = require("@azure/data-tables");

const connectionString = process.env.COSMOS_CONNECTION_STRING;
const tableName = process.env.TABLE_NAME || "VisitorCounter";
const partitionKey = "visitorCounter";
const rowKey = "counter1";

module.exports = async function (context, req) {
    const client = TableClient.fromConnectionString(connectionString, tableName);

    let visitorCount = 0;
    let entity;

    try {
        // Try to get the entity
        entity = await client.getEntity(partitionKey, rowKey);
        visitorCount = parseInt(entity.Count, 10) || 0;

        if (req.method === "POST") {
            // Increment count only on POST
            entity.Count = visitorCount + 1;

            // Remove invalid system properties before update
            delete entity['odata.metadata'];
            delete entity['odata.etag'];

            await client.updateEntity(entity, "Merge");
            visitorCount = entity.Count;
        }

    } catch (error) {
        if (error.statusCode === 404) {
            // Entity doesn't exist—create it
            entity = {
                partitionKey: partitionKey,
                rowKey: rowKey,
                Count: 1
            };
            await client.createEntity(entity);
            visitorCount = 1;
        } else {
            context.log.error("Error updating count:", error);
            context.res = {
                status: 500,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                },
                body: { error: "Error updating visitor count" }
            };
            return;
        }
    }

    context.res = {
        status: 200,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type"
        },
        body: { count: visitorCount }
    };
};


// const { TableClient } = require("@azure/data-tables");

// const connectionString = process.env.COSMOS_CONNECTION_STRING;
// const tableName = process.env.TABLE_NAME || "VisitorCounter";
// const partitionKey = "visitorCounter";
// const rowKey = "counter1";

// module.exports = async function (context, req) {
//     const client = TableClient.fromConnectionString(connectionString, tableName);

//     let visitorCount = 0;
//     let entity;
//     try {
//         // Try to get the entity
//         entity = await client.getEntity(partitionKey, rowKey);
//         visitorCount = parseInt(entity.Count, 10) || 0;
//         // Increment count
//         entity.Count = visitorCount + 1;
//         // Remove invalid system properties before update
// delete entity['odata.metadata'];
// delete entity['odata.etag'];
// // Remove other odata.* if present



//         await client.updateEntity(entity, "Merge");
//     } catch (error) {
//         if (error.statusCode === 404) {
//             // Entity doesn't exist—create
//             entity = {
//                 partitionKey: partitionKey,
//                 rowKey: rowKey,
//                 Count: 1
//             };
//             await client.createEntity(entity);
//             visitorCount = 1;
//         } else {
//             context.log.error("Error updating count:", error);
//             return {
//                 status: 500,
//                 body: "Error updating visitor count"
//             };
//         }
//     }

//     context.res = {
//         status: 200,
//         body: entity.Count
//     };
// };

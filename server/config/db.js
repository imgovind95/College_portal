// const mongoose = require('mongoose');

// const connectDB = async () => {
//     try {
//         const conn = await mongoose.connect(process.env.MONGO_URI, {
//             // Connection pool for scalability (supports up to 10k concurrent users)
//             maxPoolSize: 50,
//             minPoolSize: 5,
//             serverSelectionTimeoutMS: 5000,
//             socketTimeoutMS: 45000,
//         });
//         console.log(`✅ MongoDB connected: ${conn.connection.host}`);
//     } catch (err) {
//         console.error(`❌ MongoDB connection error: ${err.message}`);
//         process.exit(1);
//     }
// };

// module.exports = connectDB;

const mongoose = require('mongoose');

// Vercel Serverless ke liye connection state track karna zaroori hai
let isConnected = false;

const connectDB = async () => {
    // Agar existing connection hai, toh naya mat banao (saves timeouts & memory)
    if (isConnected) {
        console.log('=> Using existing database connection');
        return;
    }

    try {
        console.log('=> Creating new database connection');
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            // Vercel Serverless ke liye pool size thoda chota rakhna safe hota hai
            maxPoolSize: 10, 
            minPoolSize: 1,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });

        // Connection successful hone par state update kar do
        isConnected = conn.connections[0].readyState === 1;
        console.log(`✅ MongoDB connected: ${conn.connection.host}`);
        
    } catch (err) {
        console.error(`❌ MongoDB connection error: ${err.message}`);
        
        // ⚠️ VERCEL PAR KABHI BHI process.exit(1) USE NAHI KARNA
        // process.exit(1); 
        
        // Iski jagah error throw karein, taaki frontend ko proper 500 JSON response mile
        throw new Error('Database connection failed');
    }
};

module.exports = connectDB;

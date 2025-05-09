import { Webhook } from "svix";
import User from "../models/user.js"

//API Controller Function to Manage Clerk User with database

export const clerkWebHooks = async (req, res)=>{
    try {
        console.log("Clerk webhook received")
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)

        const evt= whook.verify (req.body, {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"]
        })

        const {data, type} = evt;

        console.log("📦 Event Type:", type);
        console.log("👤 User Data:", data);

        switch (type) {
            case 'user.created': {
                const userData = {
                    _id: data.id,
                    email: data.email_addresses[0].email_address,
                    name: data.first_name + " " + data.last_name,
                    imageUrl: data.image_url,
                }
                console.log("📥 Saving user:", userData);
                await User.create(userData)
                console.log("✅ User saved to DB");
                res.json({})
                break;
            }

            case 'user.updated': {
                const userData = {
                    email: data.email_address[0].email_address,
                    name: data.first_name + " " + data.last_name,
                    imageUrl: data.image_url,
                }
                await User.findByIdAndUpdate(data.id, userData)
                res.json({})
                break;
            }

            case 'user.deleted': {
                await User.findByIdAndDelete(data.id)
                res.json({})
                break;
            }
        
            default:
                res.json({});
                break;
        }
    } catch (error) {
        console.error("❌ Webhook error:", error.message);
        res.status(500).json({success: false, message: error.message})
    }
}
import { Webhook } from "svix";
import User from "../models/User.js"
import Stripe from "stripe";
import { Purchase } from "../models/Purchase.js";
import Course from "../models/Course.js";

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

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY)

export const stripeWebhooks = async(req, res) =>{
    const sig = req.headers['stripe-signature'];
    console.log('Received Webhook Signature:', sig);
    console.log('Request Body:', req.body); 

  let event;

  try {
    event = Stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    console.log('Event constructed:', event);
  }
  catch (err) {
    console.error('❌ Error constructing event:', err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
        const session = event.data.object;
    
        const purchaseId = session.metadata.purchaseId;
    
        const purchaseData = await Purchase.findById(purchaseId);
        if (purchaseData) {
            purchaseData.status = 'completed';
            await purchaseData.save();
        }
    
        // Optional: update user & course records
        const userData = await User.findById(purchaseData.userId);
        const courseData = await Course.findById(purchaseData.courseId.toString());
    
        courseData.enrolledStudents.push(userData);
        await courseData.save();
    
        userData.enrolledCourses.push(courseData._id);
        await userData.save();
    
        break;
    } 
    
    /* case 'payment_intent.succeeded':{
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id;

      const session = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntentId
      })

      const { purchaseId } = session.data[0].metadata;

      const purchaseData = await Purchase.findById(purchaseId)
      const userData = await User.findById(purchaseData.userId)
      const courseData = await Course.findById(purchaseData.courseId.toString())

      courseData.enrolledStudents.push(userData)
      await courseData.save()

      userData.enrolledCourses.push(courseData._id)
      await userData.save()

      purchaseData.status = 'completed'
      await purchaseData.save()

      break;} */

    case 'payment_intent.payment_failed':{
        const paymentIntent = event.data.object;
        const paymentIntentId = paymentIntent.id;
  
        const session = await stripeInstance.checkout.sessions.list({
          payment_intent: paymentIntentId
        })
  
        const { purchaseId } = session.data[0].metadata;

        const purchaseData = await Purchase.findById(purchaseId)
        purchaseData.status = 'failed'
        await purchaseData.save()

      break;}
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a response to acknowledge receipt of the event
  res.json({received: true});
}
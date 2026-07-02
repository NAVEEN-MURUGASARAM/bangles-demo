/**
 * Service to dispatch email notifications via EmailJS REST API.
 * The store owner can easily configure their credentials below.
 */
export const sendOrderEmail = async (orderData) => {
  // CONFIGURATION: Replace these values with your actual EmailJS configurations
  const SERVICE_ID = "service_placeholder"; // Replace with your Service ID from "Email Services" tab
  const TEMPLATE_ID = "template_placeholder"; // Replace with your Template ID from "Email Templates" tab
  const PUBLIC_KEY = "MjUpRlqPnrGddtDwB"; // Configured EmailJS Public Key

  // Format order items for the email template
  const itemsList = orderData.items
    .map(
      (item) =>
        `- ${item.name} (Size: ${item.variant.size}, Color: ${item.variant.color}) x ${item.quantity} - ₹${(
          item.price * item.quantity
        ).toFixed(2)}`
    )
    .join("\n");

  const templateParams = {
    to_name: "Sparkle Bangles Admin",
    from_name: orderData.name,
    from_email: orderData.email,
    order_id: orderData.id,
    order_total: `₹${orderData.totalPrice.toFixed(2)}`,
    shipping_address: orderData.address,
    items_list: itemsList,
    order_date: new Date(orderData.timestamp).toLocaleString(),
  };

  // If placeholders are not replaced, log warning and return success to avoid blocking checkout
  if (
    SERVICE_ID === "service_placeholder" ||
    TEMPLATE_ID === "template_placeholder" ||
    PUBLIC_KEY === "public_placeholder"
  ) {
    console.warn(
      "EmailJS credentials (Service ID or Template ID) are not configured. To enable live email notifications, update SERVICE_ID and TEMPLATE_ID in src/utils/emailService.js"
    );
    return true; 
  }

  try {
    const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        service_id: SERVICE_ID,
        template_id: TEMPLATE_ID,
        user_id: PUBLIC_KEY,
        template_params: templateParams,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`EmailJS REST API error: ${errorText}`);
    }

    console.log("Email notification sent successfully via EmailJS!");
    return true;
  } catch (error) {
    console.error("Failed to send order email notification via EmailJS:", error);
    // Return false, but do not block checkout flow
    return false;
  }
};

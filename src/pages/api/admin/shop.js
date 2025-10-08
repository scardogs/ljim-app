import connectToDatabase from "../../../lib/mongodb";
import ShopContent from "../../../../models/ShopContent";
import { authMiddleware } from "../../../utils/auth";
import {
  deleteImageFile,
  deleteOldImageIfChanged,
} from "../../../utils/imageCleanup";

async function handler(req, res) {
  await connectToDatabase();

  if (req.method === "GET") {
    try {
      let content = await ShopContent.findOne();

      if (!content) {
        content = await ShopContent.create({});
      }

      res.status(200).json(content);
    } catch (error) {
      console.error("Error fetching shop content:", error);
      res.status(500).json({ error: "Failed to fetch shop content" });
    }
  } else if (req.method === "PUT") {
    try {
      const updates = req.body;

      let content = await ShopContent.findOne();

      if (content) {
        // Check for deleted or updated products and clean up their images
        const oldProducts = content.products || [];
        const newProducts = updates.products || [];

        // Find products that were deleted or had their images changed
        oldProducts.forEach((oldProduct) => {
          const newProduct = newProducts.find((p, index) => {
            // Match by index or other unique identifier
            return oldProducts.indexOf(oldProduct) === newProducts.indexOf(p);
          });

          if (!newProduct) {
            // Product was deleted - remove its image
            if (oldProduct.image) {
              deleteImageFile(oldProduct.image);
            }
          } else if (
            oldProduct.image &&
            newProduct.image &&
            oldProduct.image !== newProduct.image
          ) {
            // Product image was changed - delete old image
            deleteOldImageIfChanged(oldProduct.image, newProduct.image);
          }
        });

        content = await ShopContent.findByIdAndUpdate(content._id, updates, {
          new: true,
          runValidators: true,
        });
      } else {
        content = await ShopContent.create(updates);
      }

      res.status(200).json({
        message: "Shop content updated successfully",
        content,
      });
    } catch (error) {
      console.error("Error updating shop content:", error);
      res.status(500).json({ error: "Failed to update shop content" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}

export default async function shopHandler(req, res) {
  if (req.method === "GET") {
    return handler(req, res);
  } else {
    return authMiddleware(handler)(req, res);
  }
}

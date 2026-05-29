import React from 'react'
import { Label } from "@/label";
import { Input } from "@/input";
import { Button } from "@/components/button";
import { Card, CardHeader } from '@/card';
import { X } from 'lucide-react';



const ImageUpload = ({ productData, setProductData }) => {


  if (typeof setProductData !== "function") {
    console.error("❌ setProductData is not a function");
    return null;
  }

  // upload handler
  const handleFiles = (e) => {
    const files = Array.from(e.target.files || []);

    if (!files.length) return;

    setProductData((prev) => ({
      ...prev,
      productImg: [...(prev?.productImg || []), ...files],
    }));

    // 🔥 reset input (same file reselect fix)
    e.target.value = "";
  };

  // remove image
  const removeImage = (index) => {
    setProductData((prev) => {
      const updatedImages = (prev?.productImg || []).filter(
        (_, i) => i !== index
      );

      return {
        ...prev,
        productImg: updatedImages,
      };
    });
  };


  return (
    <div className="grid gap-2">

     

      {/* Hidden Input */}
      <Input
        type="file"
        id="file-upload"
        className="hidden"
        accept="image/*"
        multiple
        onChange={handleFiles}
      />

      {/* Upload Button */}
      <Button variant="outline" asChild>
        <label htmlFor="file-upload" className="cursor-pointer">
          Upload Images
        </label>
      </Button>

      {/* Image Preview */}
      {productData?.productImg?.length > 0 && (
        <div className="grid grid-cols-2 gap-4 mt-3 sm:grid-cols-3">
          {productData.productImg.map((file, idx) => {

            let preview = "";

            if (file && file.type?.startsWith("image/")) {
              preview = URL.createObjectURL(file);
            } else if (typeof file === "string") {
              preview = file;
            } else if (file?.url) {
              preview = file.url;
            }

            if (!preview) return null;

            return (
              <Card
                key={idx}
                className="relative group overflow-hidden rounded-md" >
                <CardHeader>
                  <img
                    src={preview}
                    alt="preview"
                    onLoad={() => URL.revokeObjectURL(preview)}
                    className="w-full h-32 object-cover"
                  />

                  {/* Remove Button */}
                  <button
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 bg-black/60 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                  >
                    <X size={14} />
                  </button>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
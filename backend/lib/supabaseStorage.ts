import { supabase } from "./supabase";

export async function uploadListingPhotos(
  photos: File[],
  listingId: string,
): Promise<string[]> {
  const imageRefs: string[] = [];
  for (const photo of photos) {
    const extension = photo.name.split(".").pop() || "jpg";

    const fileName = `${crypto.randomUUID()}.${extension}`;

    const filePath = `${listingId}/${fileName}`;

    const { error } = await supabase.storage
      .from("listing-images")
      .upload(filePath, photo, { contentType: photo.type, upsert: false });

    if (error) {
      throw new Error(`Failed to upload ${photo.name}: ${error.message}`);
    }

    const { data } = supabase.storage
      .from("listing-images")
      .getPublicUrl(filePath);

    imageRefs.push(data.publicUrl);
  }
  return imageRefs;
}

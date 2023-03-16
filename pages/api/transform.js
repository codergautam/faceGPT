// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

async function replicate(version, input) {
  let startResponse = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Token " + process.env.REPLICATE_API_KEY,
    },
    body: JSON.stringify({
      version,
      input
    }),
  });

  let jsonStartResponse = await startResponse.json();

  let endpointUrl = jsonStartResponse.urls.get;
  const originalImage = jsonStartResponse.input.image;
  const genId = jsonStartResponse.id;

  // GET request to get the status of the image restoration process & return the result when it's ready
  let generatedImage;
  while (!generatedImage) {
    // Loop in 1s intervals until the alt text is ready
    console.log("polling for result...", genId);
    let finalResponse = await fetch(endpointUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token " + process.env.REPLICATE_API_KEY,
      },
    });
    let jsonFinalResponse = await finalResponse.json();

    if (jsonFinalResponse.status === "succeeded") {
      console.log("got result!", genId, jsonFinalResponse.output);
      generatedImage = jsonFinalResponse.output;
    } else if (jsonFinalResponse.status === "failed") {
      break;
    } else {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  return { originalImage, generatedImage, genId, success: !!generatedImage };
}

export default async function handler(req, res) {
  // Only work on POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  // Get the image URL and change from the request body
  let { imgUrl, change } = req.body;
  console.log("received", imgUrl, change);
  imgUrl = imgUrl.replace(/w=\d+/, "w=360").replace(/h=\d+/, "h=360");

  const { generatedImage, genId } = await replicate("cc8066f617b6c99fdb134bc1195c5291cf2610875da4985a39de50ee1f46d81c", {
    image: imgUrl,
    prompt: change,
  })
  // POST request to Replicate to start the image restoration generation process

  res.status(200).json(
   generatedImage && generatedImage.length > 0
      ? {
          original: imgUrl,
          generated: generatedImage[1],
          id: genId,
          success: true,
        }
      : {
        error: "Failed to restore image",
        success: false,
      }
  );

}

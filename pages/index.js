import Link from 'next/link'
import { signIn, signOut, useSession } from 'next-auth/react'
import styles from '../styles/Home.module.css'
import { Uploader } from 'uploader'
import { UploadDropzone } from 'react-uploader';
import { useEffect, useState } from 'react';
import Image from 'next/image'


const uploader = Uploader({
  apiKey: !!process.env.NEXT_PUBLIC_UPLOAD_PUBLIC
    ? process.env.NEXT_PUBLIC_UPLOAD_PUBLIC
    : "free",
});

const shimmer = (w, h) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#333" offset="20%" />
      <stop stop-color="#222" offset="50%" />
      <stop stop-color="#333" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#333" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`

const toBase64 = (str) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str)

async function submitImg(imgUrl, change) {
  const res = await fetch("/api/transform", {
    method: "POST",
    body: JSON.stringify({
      imgUrl,
      change,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  return data;
}

export default function Home() {
  const {data: session} = useSession()
  const [startUrl, setStartUrl] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [undoUrl, setUndoUrl] = useState(null);
  const [text, setText] = useState("");

  useEffect(() => {

  }, [startUrl])

  return (
    <main>
    <div className={styles.center}>
      <h1 className={styles.title}>
        faceGPT
      </h1>
      <p className={styles.description}>
        Make your face look cooler with the power of AI
      </p>
      <center>
  {!session ? (
    <button className={styles.button} onClick={() => signIn()}>
      Get Started!
    </button>
  ) : startUrl ? (
    <div>
      <Image placeholder='blur' blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(300, 300))}`} src={startUrl} width={300} height={300} />
      <br />
      <input type="text" className={styles.input} value={text} onInput={(e) => {
        setText(e.target.value);
      }} placeholder='How would you like to modify this image?' />
      <br />
      <button className={styles.button} style={{width: "150px"}} onClick={async () => {
        setSubmitting(true);
        const data = await submitImg(startUrl, text);
        setSubmitting(false);
        if(!data.success) {
          alert("Error: " + data.error);
        } else {
          setUndoUrl(startUrl);
          setStartUrl(data.generated);
        }
      }}>
        {submitting ? "..." : "Go!"}
      </button>
    </div>
  ) : (
    <UploadDropzone
      uploader={uploader}
      options={{ multi: false }}
      onUpdate={(files) => {
        if (files.length >= 1) {
          setStartUrl(files[0].fileUrl);
        }
      }}
    ></UploadDropzone>
  )}
</center>

    </div>
    </main>
  )
}
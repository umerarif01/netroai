import Head from "next/head";
import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Search } from "heroicons-react";
import { CircularProgress } from "@mui/material";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "#030405",
  border: "2px solid #000",
  boxShadow: 5,
  p: 4,
};

export default function Home() {
  const [prompt, setPrompt] = useState<string>("");
  const [size, setSize] = useState<string>("");
  const [imgUrl, setImgUrl] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const showLoading = () => setLoading(false);
  const removeLoading = () => setLoading(true);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (prompt === "") {
      alert("Please type something in the input field");
      return;
    }

    handleOpen();
    showLoading();
    setImgUrl("");

    const response = await fetch("/api/generateImage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        size,
      }),
    });
    const data = await response.json();
    console.log(data);
    setImgUrl(data.data);
    removeLoading();
  }

  return (
    <div className="">
      <Head>
        <title>NETRO AI</title>
        <meta
          name="description"
          content="Let AI turn your imagination into reality"
        />
      </Head>

      <main className="">
        <form
          className="flex flex-col items-center mt-[300px]"
          onSubmit={onSubmit}
        >
          <h1 className="text-white text-6xl font-extrabold xl:text-8xl md:text-7xl ">
            NETRO<span className="text-purple-600">AI</span>
          </h1>
          <h1 className="text-white text-lg font-bold xl:text-2xl md:text-xl ">
            Let AI turn your imagination into reality
            {process.env.NEXT_PUBLIC_OPENAI_API_KEY}
          </h1>
          <div
            className="flex w-full mt-5 rounded-full border-2 border-gray-600
      py-3 px-5 items-center max-w-md sm:max-w-xl lg:max-w-2xl"
          >
            <Search className="h-5 mr-3 text-purple-600" />
            <input
              type="text"
              onChange={(event) => setPrompt(event?.target.value)}
              className="bg-transparent text-white 
      focus:outline-none flex-grow l font-semibold"
            />

            <select
              className="bg-transparent text-white 
            focus:outline-none rounded-full border-2 px-2 py-1 border-gray-600 font-bold"
              value={size}
              onChange={(event) => setSize(event?.target.value)}
            >
              <option>Small</option>
              <option>Medium</option>
              <option>Large</option>
            </select>
          </div>
          <input className="btn " value="Generate" type="submit" />
        </form>

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            {loading ? (
              <div className="flex flex-col items-center">
                <img src={imgUrl} alt="img was not generated" />
                <div className="mt-4 flex justify-between">
                  {" "}
                  <a target="_blank" rel="noreferrer" href={imgUrl} download>
                    <Button variant="contained" color="success">
                      Download
                    </Button>
                  </a>
                  <div className="mr-4 " />
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={handleClose}
                  >
                    Close
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <CircularProgress />
                <h1 className="font-medium text-lg mt-2">Generating...</h1>
              </div>
            )}
          </Box>
        </Modal>
      </main>
    </div>
  );
}

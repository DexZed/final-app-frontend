import { useRef, useState, useMemo } from "react";
import JoditEditor from "jodit-react";
import { useAuthContext } from "../../../contexts/context";

type Props = { placeholder?: string };

function Blog({ placeholder }: Props) {
    const {getAuthToken} = useAuthContext();
  const editor = useRef(null);
  const [content, setContent] = useState("");
  const [fields, setFields] = useState({
    title: "",
    content: "",
    picture: "",
  });
 
  const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;

    // If the field is for the avatar image (file input), handle it differently

    if (name === "picture" && files) {
      const file = files[0]; // Get the selected file
      console.log(file);

      // Upload the image to ImgBB
      const formData = new FormData();
      formData.append("image", file);
      console.log(formData);
      const response = await fetch(
        `https://api.imgbb.com/1/upload?expiration=300&key=${
          import.meta.env.VITE_IMGBB_API_KEY
        }`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      if (data.success) {
        // Set the image URL in the state
        const imageUrl = data.data.url;

        setFields((prev: any) => ({ ...prev, [name]: imageUrl }));
        console.log(`Image URL: ${imageUrl}`);
      } else {
        console.error("Image upload failed:", data);
      }
    } else {
      // Handle other form fields (text inputs, selects, etc.)
      setFields((prev: any) => {
        const updatedFields = { ...prev, [name]: value };

        return updatedFields;
      });
    }
  };
  const handleEditorBlur = (newContent: string) => {
    const plainText = newContent.replace(/<[^>]*>/g, "");
    console.log("Editor blur:", newContent);
    setContent(newContent);
    setFields((prev) => ({
      ...prev,
      content: plainText, // Update content in fields
    }));
  };
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const { title, picture, content } = fields;
    // console log the values
    console.log(title, picture, content);

    const postContent = {
        title,
        content,
      picture,
      status:"draft"
    }
    // Send the form data to the server
    try {
        const { api } = await import("../../../services/api");
    const {showSuccessAlert} = await import("../../../utils/utilities");
    const token = await getAuthToken();
      await api.post("/api/createPost", postContent, {
        headers: { Authorization: `Bearer ${token}` },
      });

      showSuccessAlert("Success", "Successfully signed up");
      console.log("Successfully post created");
    } catch (error) {
        console.error("Error creating post:", error);
        const {showErrorAlert} = await import("../../../utils/utilities");
        showErrorAlert("Error", "Failed to create post");
    }
  }

  const config = useMemo(
    () => ({
      readonly: false, // all options from https://xdsoft.net/jodit/docs/,
      placeholder: placeholder || "Start typings...",
    }),
    [placeholder]
  );
  return (
    <>
      <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content text-center">
          <form onSubmit={handleSubmit}>
            <fieldset className="flex flex-col">
              <legend className="text-3xl font-bold">Blog</legend>
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text">Title</span>
                </div>
                <input
                  onChange={handleChange}
                  name="title"
                  type="text"
                  placeholder="Wild Rift"
                  className="input input-secondary input-bordered w-full max-w-xs"
                />
              </label>

              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text">Picture</span>
                </div>
                <input
                  onChange={handleChange}
                  name="picture"
                  type="file"
                  placeholder="Wild Rift"
                  className="file-input file-input-bordered file-input-primary w-full max-w-xs"
                />
              </label>
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text">Content</span>
                </div>
                <JoditEditor
                  ref={editor}
                  value={content}
                  config={config}
                  tabIndex={1} // tabIndex of textarea
                  onBlur={handleEditorBlur}// preferred to use only this option to update the content for performance reasons
                 
                />
              </label>
              <div className="m-10 ">
                <button  type="submit" className="btn btn-outline btn-primary">
                  Submit
                </button>
              </div>
            </fieldset>
          </form>
        </div>
      </div>
    </>
  );
}

export default Blog;

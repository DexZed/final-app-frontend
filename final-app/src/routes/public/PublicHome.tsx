import { Link } from "react-router";

type Props = {};

function PublicHome({}: Props) {
  return (
    <>
      <div
        className="hero min-h-screen inset-ring-green-500 shadow-lg shadow-blue-500/50"
        style={{
          backgroundImage:
            "url(https://static.vecteezy.com/system/resources/thumbnails/018/859/705/small_2x/abstract-red-light-hexagon-line-in-grey-modern-luxury-futuristic-background-vector.jpg)",
        }}
      >
        <div className="hero-overlay bg-opacity-60"></div>
        <div className="hero-content text-neutral-content text-center">
          <div className="max-w-md">
            <h1 className="mb-5 text-5xl font-bold">Hello there</h1>
            <figure className="mb-5 pl-4  p-4 rounded-lg shadow-sm invert">
              <blockquote className="text-lg italic text-gray-700">
                Humans are the only creature that barters, no other animal does
                this. Nobody ever saw a dog make a fair and deliberate exchange
                of one bone for another with another dog.
              </blockquote>
              <figcaption className="mt-3 text-right text-sm text-gray-500">
                — Adam Smith,{" "}
                <cite className="italic">The Wealth of Nations</cite>
              </figcaption>
            </figure>
            <div className="flex gap-5 justify-evenly">
              <Link
                to={"/donorRegister"}
                className="btn btn-secondary btn-outline rounded-xl"
              >
                Join as a donor
              </Link>
              <button className="btn btn-primary btn-outline rounded-xl">
                Search
              </button>
            </div>
          </div>
        </div>
      </div>
      <section className="hero p-4 lg:p-8 synthwave:bg-gray-100 synthwave:text-gray-800 inset-ring-blue-500 shadow-lg shadow-indigo-500/50">
        <div className="container mx-auto space-y-12">
          <div className="flex flex-col overflow-hidden rounded-md shadow-sm lg:flex-row">
            <img
              src="./1.webp"
              alt=""
              className="h-80 synthwave:bg-gray-500 aspect-video"
            />
            <div className="flex flex-col justify-center flex-1 p-6 synthwave:bg-gray-50">
              <span className="text-xs uppercase synthwave:text-gray-600">
                Join, it's free
              </span>
              <h3 className="text-3xl font-bold">
                We're not reinventing the wheel
              </h3>
              <p className="my-6 synthwave:text-gray-600">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor
                aliquam possimus quas, error esse quos.
              </p>
              <button type="button" className="self-start">
                Action
              </button>
            </div>
          </div>
          <div className="flex flex-col overflow-hidden rounded-md shadow-sm lg:flex-row-reverse">
            <img
              src="./2.webp"
              alt=""
              className="h-80 synthwave:bg-gray-500 aspect-video"
            />
            <div className="flex flex-col justify-center flex-1 p-6 synthwave:bg-gray-50">
              <span className="text-xs uppercase synthwave:text-gray-600">
                Join, it's free
              </span>
              <h3 className="text-3xl font-bold">
                We're not reinventing the wheel
              </h3>
              <p className="my-6 synthwave:text-gray-600">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor
                aliquam possimus quas, error esse quos.
              </p>
              <button type="button" className="self-start">
                Action
              </button>
            </div>
          </div>
          <div className="flex flex-col overflow-hidden rounded-md shadow-sm lg:flex-row">
            <img
              src="./3.webp"
              alt=""
              className="h-80 synthwave:bg-gray-500 aspect-video"
            />
            <div className="flex flex-col justify-center flex-1 p-6 synthwave:bg-gray-50">
              <span className="text-xs uppercase synthwave:text-gray-600">
                Join, it's free
              </span>
              <h3 className="text-3xl font-bold">
                We're not reinventing the wheel
              </h3>
              <p className="my-6 synthwave:text-gray-600">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor
                aliquam possimus quas, error esse quos.
              </p>
              <button type="button" className="self-start">
                Action
              </button>
            </div>
          </div>
        </div>
      </section>
      <section className="hero py-6 synthwave:bg-gray-100 synthwave:text-gray-900 inset-ring-purple-500 shadow-lg shadow-red-500/50 m-5 -translate-x-4">
        <div className="grid max-w-6xl grid-cols-1 px-6 mx-auto lg:px-8 md:grid-cols-2 md:divide-x">
          <div className="py-6 md:py-0 md:px-6">
            <h1 className="text-4xl font-bold">Get in touch</h1>
            <p className="pt-2 pb-4">
              Fill in the form to start a conversation
            </p>
            <div className="space-y-4">
              <p className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5 mr-2 sm:mr-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span>Fake address, 9999 City</span>
              </p>
              <p className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5 mr-2 sm:mr-6"
                >
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                </svg>
                <span>123456789</span>
              </p>
              <p className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5 mr-2 sm:mr-6"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                </svg>
                <span>contact@business.com</span>
              </p>
            </div>
          </div>
          <form
            
            className="flex flex-col py-6 space-y-6 md:py-0 md:px-6"
          >
            <label className="block">
              <span className="mb-1">Full name</span>
              <input
                type="text"
                placeholder="Leroy Jenkins"
                className="block w-full rounded-md shadow-sm focus:ring focus:ring-opacity-75 focus:synthwave:ring-violet-600 synthwave:bg-gray-100"
              />
            </label>
            <label className="block">
              <span className="mb-1">Email address</span>
              <input
                type="email"
                placeholder="leroy@jenkins.com"
                className="block w-full rounded-md shadow-sm focus:ring focus:ring-opacity-75 focus:synthwave:ring-violet-600 synthwave:bg-gray-100"
              />
            </label>
            <label className="block">
              <span className="mb-1">Message</span>
              <textarea
                rows={3}
                className="block w-full rounded-md focus:ring focus:ring-opacity-75 focus:synthwave:ring-violet-600 synthwave:bg-gray-100"
              ></textarea>
            </label>
            <button
              type="button"
              className="self-center px-8 py-3 text-lg rounded focus:ring hover:ring focus:ring-opacity-75 synthwave:bg-violet-600 synthwave:text-gray-50 focus:synthwave:ring-violet-600 hover:synthwave:ring-violet-600"
            >
              Submit
            </button>
          </form>
        </div>
      </section>
    </>
  );
}

export default PublicHome;

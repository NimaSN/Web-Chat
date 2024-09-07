import { useState } from "react";
import Typed from "react-typed";
import { Toaster } from "react-hot-toast";
import { isEmpty } from "lodash";

import { IoSend } from "react-icons/io5";
import { FaUserTie, FaRobot } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import { CgMenuRightAlt } from "react-icons/cg";

import { getCoinApi, getDigikalaApi, getTimeApi } from "./services/service";

import DotsLoading from "./utils/DotsLoading";
import { formatToPersianDate, numberSeparate } from "./utils";
import { toastMessage } from "./utils/toastMessage";

const App = () => {
  const [answers, setAnswers] = useState([]);
  const [question, setQuestion] = useState("");
  const [isClose, setIsClose] = useState(true);
  const [isLoader, setIsLoader] = useState(false);

  // Handle Get Time
  const handleGetTime = async () => {
    let datetime = "";
    try {
      setIsLoader(true);
      const { status, data } = await getTimeApi();
      if (status === 200) {
        datetime = data.datetime;
      }
    } catch ({ response }) {
      console.log("در دریافت اطلاعات مشکلی پیش آمده");
    } finally {
      setIsLoader(false);
    }
    return { datetime };
  };

  // Handle Get Coins
  const handleGetCoins = async (crypto) => {
    let coinPrices = "";
    try {
      setIsLoader(true);

      const { status, data } = await getCoinApi(crypto);
      if (status === 200) {
        coinPrices = data;
      } else {
        coinPrices = "ارز مورد نظر یافت نشد";
      }
    } catch ({ response }) {
      coinPrices = "در دریافت اطلاعات مشکلی پیش آمده";
    } finally {
      setIsLoader(false);
    }

    return { coinPrices };
  };

  // Handle Get Digikala
  const handleGetDigikala = async (productId) => {
    let product = "";
    try {
      setIsLoader(true);
      const { status, data } = await getDigikalaApi(productId);
      if (status === 200) {
        if (data.status === 200) product = data.result;
        else product = "کد محصول یافت نشد و یا محصول مورد نظر معتر نمی باشد";
      }
    } catch ({ response }) {
      product = "درخواست ارسالی با خطا مواجه شد";
    } finally {
      setIsLoader(false);
    }

    return { product };
  };

  // Handle Questions
  const handleQuestion = async (event) => {
    event.preventDefault();

    if (!question) return toastMessage("از منوی سایت کمک بگیرید");

    const answersArray = [...answers];
    switch (question) {
      // First Case
      case "ساعت چنده":
        const { datetime: time } = await handleGetTime();
        answersArray.push({
          question,
          answer: formatToPersianDate(time, "HH:mm:ss"),
        });
        break;
      // Second Case
      case "تاریخ امروز":
        const { datetime: date } = await handleGetTime();
        answersArray.push({
          question,
          answer: formatToPersianDate(date, "YYYY/MM/DD"),
        });
        break;
      // Third and Fourth Case
      default:
        const productPattern = /قیمت محصول/;
        const cryptoPattern = /قیمت ارز/;
        if (productPattern.test(question)) {
          const productId = question.replace(productPattern, "").trim();
          if (productId) {
            const { product } = await handleGetDigikala(productId);
            if (!isEmpty(product?.price)) {
              answersArray.push({
                question,
                answer: `قیمت محصول ${product?.title_fa} ${numberSeparate(
                  product?.price?.selling_price / 10
                )} تومان می باشد`,
              });
            } else
              answersArray.push({
                question,
                answer: `محصول ${product.title_fa} ناموجود می باشد`,
              });
          } else {
            answersArray.push({
              question,
              answer: "شناسه محصول معتبر نمی باشد",
            });
          }
        } else if (cryptoPattern.test(question)) {
          const symbol = question.replace(cryptoPattern, "").trim();
          if (symbol) {
            const { coinPrices } = await handleGetCoins(symbol.toUpperCase());
            answersArray.push({
              question,
              answer: `قیمت ${coinPrices.asset_id_base} ${formatToPersianDate(
                coinPrices.time,
                "در تاریخ DD MMM YYYY ساعت HH:mm"
              )} ${coinPrices.rate} ${coinPrices.asset_id_quote}`,
            });
          } else {
            answersArray.push({
              question,
              answer: "ارز وارده معتبر نمی باشد",
            });
          }
        } else {
          answersArray.push({
            question,
            answer: "جوابی برای سوال وارده تعریف نشده است",
          });
        }
    }
    setAnswers(answersArray);
    setQuestion("");
  };

  // Handle Set Input Value
  const handleInputValue = (value) => {
    setQuestion(value);
  };

  return (
    <>
      {/* Content */}
      <div className="overflow-y-hidden h-full bg-gray-900">
        <div>
          {/*  Title */}
          <div className="fixed w-full top-0 px-2 sm:px-4 lg:px-6 mx-auto text-center">
            <h1 className="md:text-3xl xs:text-2xl py-5 sml:text-xl font-bold text-gray-800 bg-gray-900  dark:text-white">
              <Typed
                strings={["به وب چت خوش آمدید!"]}
                typeSpeed={60}
                cursorChar=" "
              />
            </h1>
          </div>
          {/* End Title */}

          {/* Close Button */}
          <div className="md:hidden sml:fixed top-5 right-3">
            <button
              type="button"
              className="text-white"
              onClick={() => setIsClose(true)}
            >
              <CgMenuRightAlt size={40} />
            </button>
          </div>
          {/* End Close Button */}

          {/* Guide Menu */}
          <div
            className={`${
              isClose ? "flex" : "hidden"
            } md:flex h-full overflow-y-hidden justify-start xl:w-2/12 lg:w-3/12 md:w-4/12 xs:w-5/12 sml:w-12/12 fixed top-0 z-10 bg-gray-600 rounded-l-xl`}
          >
            {/* Close Button */}
            <div className="pr-3 pt-4 md:hidden sml:fixed">
              <button
                type="button"
                className="text-white"
                onClick={() => setIsClose(false)}
              >
                <AiOutlineClose size={25} />
              </button>
            </div>

            {/* End Close Button */}
            <div class="w-full h-full">
              {/* List */}
              <ul class="space-y-8 p-5 mt-10 flex flex-col text-gray-800 dark:text-white">
                {/* 0 */}
                <span className="font-medium md:text-lg xs:text-md sml:text-sm text-center">
                  <p>برای استفاده از ربات می توانید روی سوالات زیر کلیک کنید</p>
                </span>
                {/* 1 */}
                <button
                  onClick={() => handleInputValue("ساعت چنده")}
                  className="flex md:text-lg xs:text-sm sml:text-xs font-normal w-full cursor-pointer
                   bg-gray-700 pr-2 py-1.5 text-center rounded-xl justify-start items-center hover:bg-gray-800"
                >
                  <h1 className="pl-1">1)</h1>
                  <p>ساعت چنده</p>
                </button>
                {/* 2 */}
                <button
                  onClick={() => handleInputValue("تاریخ امروز")}
                  className="flex md:text-lg xs:text-sm sml:text-xs font-normal w-full cursor-pointer
                   bg-gray-700 pr-2 py-1.5 text-center rounded-xl justify-start items-center hover:bg-gray-800"
                >
                  <h1 className="pl-1">2)</h1>
                  <p>تاریخ امروز</p>
                </button>
                {/* 3 */}
                <button
                  onClick={() => handleInputValue("قیمت محصول ")}
                  className="flex justify-between items-center md:text-lg xs:text-sm sml:text-xs font-normal w-full cursor-pointer
                   bg-gray-700 pr-2 py-1.5 text-center rounded-xl hover:bg-gray-800"
                >
                  <span className="flex">
                    <h1 className="pl-1">3)</h1>
                    <p className="pl-1">قیمت محصول</p>
                    <p className="pt-0.5">...</p>
                  </span>
                  <span class="md:w-5 md:h-5 sml:w-4 sml:h-4 flex items-center justify-center pt-1 ml-2 bg-indigo-400 rounded-full">
                    !
                  </span>
                </button>
                {/* 4 */}
                <button
                  onClick={() => handleInputValue("قیمت ارز ")}
                  className="flex justify-between items-center md:text-lg xs:text-sm sml:text-xs font-normal w-full cursor-pointer
                   bg-gray-700 pr-2 py-1.5 text-center rounded-xl hover:bg-gray-800"
                >
                  <span className="flex">
                    <h1 className="pl-1">4)</h1>
                    <p className="pl-1">قیمت ارز</p>
                    <p className="pt-0.5">...</p>
                  </span>
                  <span class="md:w-5 md:h-5 sml:w-4 sml:h-4 flex items-center justify-center pt-1 ml-2 bg-orange-400 rounded-full">
                    !
                  </span>
                </button>
                {/* 5 and 6 and 7 */}
                <span className="pt-10 flex flex-col space-y-5">
                  {/* 5 */}
                  <span class="relative inline-block">
                    <span
                      class="absolute -top-2 right-0 flex justify-center items-center
                      md:w-5 md:h-5 sml:w-4 sml:h-4 pt-1
                     rounded-full bg-indigo-400"
                    >
                      !
                    </span>
                    <span
                      className="bg-gray-700 w-full h-full flex p-3 mr-1 rounded-xl
                    md:text-lg xs:text-sm sml:text-xs font-normal"
                    >
                      برای قیمت محصول در قسمت خالی یک عدد 7 رقمی بنویسید
                    </span>
                  </span>
                  {/* 6 */}
                  <span class="relative inline-block">
                    <span
                      class="absolute -top-2 right-0 flex justify-center items-center
                      md:w-5 md:h-5 sml:w-4 sml:h-4 pt-1
                     rounded-full bg-orange-400"
                    >
                      !
                    </span>
                    <span
                      className="bg-gray-700 w-full h-full flex p-3 mr-1 rounded-xl
                    md:text-lg xs:text-sm sml:text-xs font-normal"
                    >
                      برای قیمت ارز در قسمت خالی ارز مورد نظر خود را بنویسید
                    </span>
                  </span>
                </span>
              </ul>
              {/* End List */}
            </div>
          </div>
          {/* End Guide Menu */}

          {/* Question and Answer */}
          <div className="overflow-y-hidden mb-20 mt-20 ">
            {answers.map((_item) => (
              <ul className="mt-16 space-y-5">
                {/* Chat User */}
                <li className="max-w-4xl py-2 px-4 sm:px-6 lg:px-8 mx-auto flex gap-x-2 sm:gap-x-4">
                  {/* Icon */}
                  <span>
                    <FaUserTie
                      className="rounded-full pt-2 bg-blue-500"
                      size={25}
                      fill="white"
                    />
                  </span>
                  {/* Question Text */}
                  <div className="space-y-3 flex justify-center items-start flex-col">
                    <h2
                      className="font-medium text-gray-800 dark:text-white 
                  flex items-center justify-cent px-2 rounded-lg bg-blue-500"
                    >
                      User
                    </h2>
                    <div className="space-y-1.5">
                      <p className="mb-1.5 mr-2 text-lg font-bold text-gray-800 dark:text-white">
                        {_item.question}
                      </p>
                    </div>
                  </div>
                </li>
                {/* End Chat User */}

                {/* Chat Bot */}
                <li className="max-w-4xl py-2 px-4 sm:px-6 lg:px-8 mx-auto flex gap-x-2 sm:gap-x-4">
                  {/* Icon */}
                  <span>
                    <FaRobot
                      className="rounded-full pt-0.5 p-0.5 bg-red-500"
                      size={25}
                      fill="white"
                    />
                  </span>

                  {/* Answer Text */}
                  <div className="space-y-3 flex justify-center items-start flex-col">
                    <h2
                      className="font-medium text-gray-800 dark:text-white 
                      flex items-center justify-center px-2 rounded-lg bg-red-500"
                    >
                      Bot
                    </h2>
                    <div className="space-y-1.5">
                      <p className="mb-1.5 mr-2 text-lg font-bold text-gray-800 dark:text-white">
                        <Typed
                          strings={[_item.answer]}
                          startDelay={1000}
                          typeSpeed={40}
                          cursorChar="|"
                        />
                      </p>
                    </div>
                  </div>
                </li>
                {/*  End Chat Bot */}
              </ul>
            ))}
            {/* End Question and Answer */}
          </div>
        </div>

        {/* Search */}
        <footer className="fixed w-full bottom-0 pt-2 pb-2 sm:pt-2 sm:pb-4 bg-gray-900">
          <form onSubmit={!isLoader && handleQuestion}>
            <div className="max-w-4xl justify-center items-end mx-auto px-4 sm:px-6 lg:px-8 sticky bottom-0">
              {/*  Input */}
              <div className="flex sticky bottom-0 justify-center items-end">
                <input
                  disabled={isLoader}
                  name="text"
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="از منوی سمت راست سوال خود را بپرسید ..."
                  autoComplete="off"
                  className="block sticky p-2.5 py-3 w-full text-md focus:ring-0 ring-0
                focus:text-slate-300 bg-gray-900 text-slate-500 rounded-lg border-0 
                border-b-2 border-gray-600 focus:border-slate-400 outline-0 focus:outline-0
                 transition-all duration-300 ease-linear
                 focus:transition-all focus:duration-300 focus:ease-linear:"
                />
              </div>
              <div class="flex justify-end pt-1">
                {/*  Send Button */}
                <button
                  disabled={isLoader}
                  type="submit"
                  className="p-2 rounded-lg absolute top-1 "
                >
                  {isLoader ? (
                    <DotsLoading />
                  ) : (
                    <IoSend className="rotate-180" fill="#0ea5e9" size={25} />
                  )}
                </button>
                {/* End Send Button */}
              </div>
              {/* End Input */}
            </div>
          </form>
        </footer>
        {/* End Search */}
      </div>
      {/* End Content */}
      <Toaster />
    </>
  );
};
export default App;

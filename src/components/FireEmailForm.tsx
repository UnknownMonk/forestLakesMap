'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';

let submitForm = async (e: any, email: any) => {
  e.preventDefault();
  try {
    let res = await fetch('/api/emailList', {
      method: 'POST',
      body: JSON.stringify({
        email: email,
      }),
    });

    res = await res.json();

    if (res) {
      // setSuccuss("The Future Is Green!!");
      // setThanks(`Thanks For Joining Our Newsletter ${name}!!`);
    }
  } catch (error) {
    //   setError("Something Went Wrong?");
    console.log(error);
  }
};

let submitText = async (e: any, number: any) => {
  e.preventDefault();
  try {
    let res = await fetch('/api/textList', {
      method: 'POST',
      body: JSON.stringify({
        number: number,
      }),
    });

    res = await res.json();

    if (res) {
      // setSuccuss("The Future Is Green!!");
      // setThanks(`Thanks For Joining Our Newsletter ${name}!!`);
    }
  } catch (error) {
    //   setError("Something Went Wrong?");
    console.log(error);
  }
};

export default function FireEmailForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [number, setNumber] = useState('');
  const [error, setError] = useState('');
  const [spin, setSpin] = useState(false);

  let sendRout = () => {
    router.push('/map');
  };
  return (
    <div className="w-full h-full flex flex-col justify-center items-center ">
      <div className=" pb-4 mb-5 marker:border-white border-8 text-center rounded-lg z-10 w-[60%] h-[30%] max-[700px]:w-[100%] max-[700px]:h-[50%] bg-green-800 opacity-80  top-[4px] left-64">
        <h1 className=" mt-3 text-white text-3xl bold md:text-lg sm:text-md">
          Welcome To Forest Lakes Park Activity Tracker
        </h1>
        <p className="text-white sm:text-md md:text-lg lg:text-xl  ">
          (Want to be notified in the event of a fire enter your email or cell
          phone number below)
        </p>
        <p className="text-white text-lg mb-5">
          {/* <Link className="underline" href="/map">
          Proceed To Map
        </Link> */}
          <button
            className=" rounded-md mt-1 bg-green-600 hover:text-green-700 hover:bg-green-300 duration-300 text-white shadow p-1  "
            onClick={() => {
              setSpin(true);
              sendRout();
            }}
          >
            Proceed To map
          </button>
        </p>
        <form className=" mr-[10%] ml-[10%] flex justify-center">
          <input
            value={email}
            onChange={(e: any) => setEmail(e.target.value)}
            className="  text-center text-lg  rounded-md w-[100%] h-[40px]"
            placeholder="Enter Email"
          />
          <button
            onClick={(e) => {
              if (email.length <= 6) {
                alert('Please Enter A Valid Email');

                setEmail('');
              } else {
                submitForm(e, email);
                setEmail('');
                setError('');
              }
            }}
            className="w-1/4 bg-green-600 hover:bg-green-700 duration-300 text-white shadow p-2 rounded-r"
          >
            Send
          </button>
        </form>
        <form className=" mt-5 mr-[10%] ml-[10%] flex justify-center">
          <input
            value={number}
            onChange={(e: any) => setNumber(e.target.value)}
            className="  text-center text-lg  rounded-md w-[100%] h-[40px]"
            placeholder="Enter Cell Phone Number"
          />
          <button
            onClick={(e) => {
              if (number.length <= 9) {
                alert('Please Enter A Valid Email');

                setNumber('');
              } else {
                submitText(e, number);
                setNumber('');
              }
            }}
            className="w-1/4 bg-green-600 hover:bg-green-700 duration-300 text-white shadow p-2 rounded-r"
          >
            Send
          </button>
        </form>
      </div>
      {spin ? <LoadingSpinner /> : <></>}
    </div>
  );
}

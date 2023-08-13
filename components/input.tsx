import type { UseFormRegisterReturn } from "react-hook-form";

interface InputProps {
  label: string;
  name: string;
  kind?: "text" | "phone" | "price" | "category" | "number" | "payment"
  type: string;
  register?: UseFormRegisterReturn;
  required?: boolean;
  disabled?: boolean;
  value?: string;
  checked?: string;
}

export default function Input({
  label,
  name,
  kind = "text",
  register,
  type,
  required,
  disabled = false,
  value,
  checked,
  // ...rest
}: InputProps) {
  return (
    <div>
      <label
        className="mb-1 block text-sm font-medium text-gray-700"
        htmlFor={name}
      >
        {label}
        {kind === "payment" ? (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
        </svg>
        ) : null}
      </label>
      {kind === "text" ? (
        <div className="rounded-md relative flex items-center shadow-sm">
          <input
            id={name}
            required={required}
            {...register}
            type={type}
            className="appearance-none w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            disabled={disabled}
            value={value}
          />
        </div>
      ) : null}
      {kind === "price" ? (
        <div className="rounded-md relative flex  items-center shadow-sm">
          <div className="absolute left-0 pointer-events-none pl-3 flex items-center justify-center">
            <span className="text-gray-500 text-sm">$</span>
          </div>
          <input
            id={name}
            required={required}
            {...register}
            type={type}
            className="appearance-none pl-7 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
          />
        </div>
      ) : null}
      {kind === "phone" ? (
        <div className="flex rounded-md shadow-sm">
          <input
            id={name}
            required={required}
            {...register}
            type={type}
            className="appearance-none w-full px-3 py-2 border border-gray-300 rounded-md rounded-l-none shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
          />
        </div>
      ) : null}
      {kind === "number" ? (
        <div className="rounded-md relative flex  items-center shadow-sm">
          <input
            id={name}
            required={required}
            {...register}
            type={type}
            className="appearance-none pl-7 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
          />
        </div>
      ) : null}
      {kind === "category" ? (
        <div className="grid grid-cols-2 rounded-md shadow-sm bg-gray-200 p-3 ">
          <div className="flex items-center">
            <input
              id={name}
              required={required}
              {...register}
              type="checkbox"
              value="green"
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
            <label htmlFor="default-checkbox" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Green</label>
          </div>
          <div className="flex items-center">
            <input
              id={name}
              required={required}
              {...register}
              type="checkbox"
              value="season"
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
            <label htmlFor="default-checkbox" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Season</label>
          </div>
          <div className="flex items-center">
            <input
              id={name}
              required={required}
              {...register}
              type="checkbox"
              value="bouquet"
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
            <label htmlFor="default-checkbox" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Bouquet</label>
          </div>
          <div className="flex items-center">
            <input
              id={name}
              required={required}
              {...register}
              type="checkbox"
              value="other"
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
            <label htmlFor="default-checkbox" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Other</label>
          </div>
        </div>
      ) : null}
      {/* {kind === "payment" ? (
        <div className="flex flex-col shadow-sm pt-2 pl-1">
          <ul>
            <li className="m-1">
              <input type="radio" value="paypal" id="list-radio-license" name="list-radio" {...register} checked={checked === 'paypal' ? true : false} onChange={() => { }}></input>
              <label className="ml-2 appearance-none w-full border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500">Paypal</label>
            </li>
            <li className="m-1">
              <input type="radio" value="stride" id="list-radio-license" name="list-radio" {...register} checked={checked === 'stride' ? true : false} onChange={() => { }}></input>
              <label className="ml-2 appearance-none w-full border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500">Stride</label>
            </li>
            <li className="m-1">
              <input type="radio" value="something" id="list-radio-license" name="list-radio" {...register} checked={checked === 'something' ? true : false} onChange={() => { }}></input>
              <label className="ml-2 appearance-none w-full border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500">Something</label>
            </li>
          </ul>
        </div>
      ) : null} */}

    </div>
  );
}
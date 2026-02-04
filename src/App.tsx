import React, { useState } from "react";
import arrowIcon from "./assets/icon-arrow.svg";

function App() {
  type Values = {
    day: number | "";
    month: number | "";
    year: number | "";
  };

  type Errors = {
    day?: string;
    month?: string;
    year?: string;
  };

  type Age = {
    days: number;
    months: number;
    years: number;
  };

  const [val, SetVal] = useState<Values>({
    day: "",
    month: "",
    year: "",
  });

  const [errorStates, setErrorStates] = useState<Errors>({});
  const [age, setAge] = useState<Age>({
    days: 0,
    months: 0,
    years: 0,
  });

  const handleValue = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { id, valueAsNumber: value } = e.target;
    SetVal((prev) => ({
      ...prev,
      [id]: Number.isNaN(value) ? "" : Number(value),
    }));
  };

  const validate = (): Errors => {
    const errors: Errors = {};
    const today = new Date();

    const daysInMonth = (month: number, year: number) =>
      new Date(year, month, 0).getDate();

    for (const [key, value] of Object.entries(val)) {
      if (!value) errors[key as keyof typeof val] = "This field is required";
    }

    if (val.year && val.year > today.getFullYear())
      errors.year = "Must be in the past";
    if (
      val.month &&
      val.year === today.getFullYear() &&
      val.month > today.getMonth() + 1
    ) {
      errors.month = "Must be in the past";
    }
    if (
      val.day &&
      val.year === today.getFullYear() &&
      val.month === today.getMonth() + 1 &&
      val.day > today.getDate()
    ) {
      errors.day = "Must be in the past";
    }
    if (val.month && (val.month < 1 || val.month > 12))
      errors.month = "Must be a valid month";
    if (val.day && val.month && val.year) {
      if (val.day < 1 || val.day > 31) errors.day = "Must be a valid day";
      const maxDays = daysInMonth(val.month, val.year);
      if (val.day > maxDays) errors.day = "Must be a valid date";
    }
    return errors;
  };

  const calculateAge = () => {
    if (val.day === "" || val.month === "" || val.year === "") return;

    const today = new Date();
    const birthDate = new Date(val.year, val.month - 1, val.day);

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    setAge({ days, months, years });
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const errors = validate();
    setErrorStates(errors);

    if (Object.keys(errors).length > 0) return;

    calculateAge();
  };

  return (
    <>
      <main className="font-poppins w-screen h-screen lg:p-0 p-3 bg-grey-200 flex items-center justify-center">
        <div className="flex flex-col items-start w-125 lg:w-150 rounded-xl rounded-br-[100px] bg-grey-100 p-4 md:p-8 gap-4">
          <div className="flex relative md:pt-4 pt-2 lg:pr-20 pb-10 md:pb-12  border-b-2 gap-3 border-grey-200 ">
            <button
              className="bg-primary hover:bg-black cursor-pointer duration-300 rounded-full flex items-center p-5 absolute -bottom-8 lg:-right-8 left-5/12 lg:left-auto justify-center"
              onClick={(e) => handleSubmit(e)}
            >
              <img src={arrowIcon} alt="" className="lg:w-8 lg:h-8 w-4 h-4" />
            </button>
            <div className="label">
              <label
                htmlFor="day"
                className={errorStates.day ? "text-error!" : ""}
              >
                Day
              </label>
              <input
                type="number"
                id="day"
                placeholder="DD"
                min="1"
                className={errorStates.day ? "border-error!" : ""}
                onChange={(e) => handleValue(e)}
              />
              {errorStates.day && <p className="error">{errorStates.day}</p>}
            </div>
            <div className="label">
              <label
                htmlFor="month"
                className={errorStates.month ? "text-error!" : ""}
              >
                Month
              </label>
              <input
                type="number"
                id="month"
                placeholder="MM"
                min="1"
                className={errorStates.month ? "border-error!" : ""}
                onChange={(e) => handleValue(e)}
              />
              {errorStates.month && (
                <p className="error">{errorStates.month}</p>
              )}
            </div>
            <div className="label">
              <label
                htmlFor="year"
                className={errorStates.year ? "text-error!" : ""}
              >
                Year
              </label>
              <input
                type="number"
                id="year"
                placeholder="YYYY"
                min="1"
                className={errorStates.year ? "border-error!" : ""}
                onChange={(e) => handleValue(e)}
              />
              {errorStates.year && <p className="error">{errorStates.year}</p>}
            </div>
          </div>
          <div className="flex flex-col py-6 pt-10 lg:pt-6">
            <p className="output">
              {age.years ? <span>{age.years}</span> : <span>--</span>}
              years
            </p>
            <p className="output">
              {age.months ? <span>{age.months}</span> : <span>--</span>}
              months
            </p>
            <p className="output">
              {age.days ? <span>{age.days}</span> : <span>--</span>}
              days
            </p>
          </div>
        </div>
      </main>
    </>
  );
}

export default App;

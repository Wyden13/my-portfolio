export default function Footer() {
  return (
    <footer className="text-center py-4 text-[var(--text-secondary)] bg-[--background]">
      <div className="mb-2">
        <button
          id="github"
          className="bg-gray-700 p-1 rounded-sm hover:bg-yellow-500 transition-colors duration-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            stroke="#ffffffff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path
              fill="none"
              d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77A5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.4 13.4 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"
            />
          </svg>
        </button>
        <button
          id="linkedin"
          className="bg-gray-700 ml-4 p-1 rounded-sm hover:bg-yellow-500 transition-colors duration-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 680 850"
            width="24"
            height="24"
            fill="#ffffffff"
            // style="opacity:1;"
          >
            <path d="M165 90q0 35-21 59t-62 24q-37 0-59-24T0 95q0-35 23-61T83 8t60 24t22 58M0 750h165V214H0zm560-528q-32 0-57 8t-45 21t-33 27t-21 27h-4l-9-70H243q0 34 2 74t2 86v355h165V457q0-12 1-22t3-19q4-11 11-23t16-21t22-16t29-6q44 0 64 32t19 83v285h165V445q0-57-14-99t-38-70t-58-41t-72-13" />
          </svg>
        </button>
        <button
          id="instagram"
          className="bg-gray-700 ml-4 p-1 rounded-sm hover:bg-yellow-500 transition-colors duration-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 740 850"
            width="24"
            height="24"
            fill="#ffffffff"
            // style="opacity:1;"
          >
            <path d="M372 182q41 0 77 15t63 42t42 63t15 77t-15 76t-42 63t-63 42t-77 16t-77-16t-62-42t-42-63t-16-76t16-77t42-63t62-42t77-15m0 324q26 0 49-10t41-27t27-41t10-49t-10-50t-27-41t-41-27t-49-10t-49 10t-41 27t-27 41t-10 50t10 49t27 41t41 27t49 10m368-314q9 187 0 374q-2 36-17 68t-39 56t-57 40t-68 17q-47 2-93 3t-94 1t-93-1t-94-3q-36-2-68-17t-56-40t-40-56t-17-68q-8-187 0-374q2-36 17-68t40-57t56-39t68-17q187-9 374 0q36 2 68 17t57 39t39 57t17 68m-70 370q9-183 0-367q-1-22-11-42t-25-36t-36-26t-42-11q-46-2-92-3t-92-1t-92 1t-92 3q-22 1-42 11t-35 26t-26 36t-11 42q-9 184 0 368q1 22 11 42t26 35t35 26t42 11q184 9 368 0q22-1 42-11t36-26t25-36t11-42M569 138q18 0 31 13t13 31t-13 31t-31 13t-31-13t-13-31t13-31t31-13" />
          </svg>
        </button>
      </div>
      &copy; {new Date().getFullYear()} My Portfolio. All rights reserved.
    </footer>
  );
}

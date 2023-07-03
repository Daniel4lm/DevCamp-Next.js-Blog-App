const HambButton = () => {
    return (
        <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
        >
            <path d="M2 16H30" stroke="currentColor" strokeWidth="3" />
            <path d="M2 24H30" stroke="currentColor" strokeWidth="3" />
            <path d="M2 8H30" stroke="currentColor" strokeWidth="3" />
        </svg>
    )
}

const AppIcon = () => {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 md:w-6 md:h-6"
        >
            <g clipPath="url(#clip0_1514_10)">
                <path
                    d="M6 1H3C1.89543 1 1 1.89543 1 3V6C1 7.10457 1.89543 8 3 8H6C7.10457 8 8 7.10457 8 6V3C8 1.89543 7.10457 1 6 1Z"
                    fill="#6B78F3"
                    stroke="#6B78F3"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M17 1H14C12.8954 1 12 1.89543 12 3V6C12 7.10457 12.8954 8 14 8H17C18.1046 8 19 7.10457 19 6V3C19 1.89543 18.1046 1 17 1Z"
                    fill="#B1B8F8"
                    stroke="#B1B8F8"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M17 12H14C12.8954 12 12 12.8954 12 14V17C12 18.1046 12.8954 19 14 19H17C18.1046 19 19 18.1046 19 17V14C19 12.8954 18.1046 12 17 12Z"
                    fill="#6B78F3"
                    stroke="#6B78F3"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M6 12H3C1.89543 12 1 12.8954 1 14V17C1 18.1046 1.89543 19 3 19H6C7.10457 19 8 18.1046 8 17V14C8 12.8954 7.10457 12 6 12Z"
                    fill="#B1B8F8"
                    stroke="#B1B8F8"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </g>
            <defs>
                <clipPath id="clip0_1514_10">
                    <rect width="20" height="20" fill="white" />
                </clipPath>
            </defs>
        </svg>
    )
}

const HomeIcon = () => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            width="24"
            height="24"
            className="lg:w-7 lg:h-7"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.4"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
        </svg>
    )
}

const NewIcon = () => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            width="24"
            height="24"
            className="lg:w-7 lg:h-7"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.4"
                d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
        </svg>
    )
}

const ShowPassIcon = () => {
    return (
        <svg
            id={'show-password-icon'}
            viewBox="0 0 16 14"
            width="100%"
            height="100%"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <g clipPath="url(#clip0_1601_2)">
                <path
                    d="M0.666626 6.99993C0.666626 6.99993 3.33329 1.25635 7.99996 1.25635C12.6666 1.25635 15.3333 6.99993 15.3333 6.99993C15.3333 6.99993 12.6666 12.7435 7.99996 12.7435C3.33329 12.7435 0.666626 6.99993 0.666626 6.99993Z"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M8 9.15388C9.10457 9.15388 10 8.18957 10 7.00004C10 5.8105 9.10457 4.84619 8 4.84619C6.89543 4.84619 6 5.8105 6 7.00004C6 8.18957 6.89543 9.15388 8 9.15388Z"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </g>
            <defs>
                <clipPath id="clip0_1601_2">
                    <rect width="16" height="14" fill="white" />
                </clipPath>
            </defs>
        </svg>
    )
}

const HidePassIcon = () => {
    return (
        <svg
            id={'hide-password-icon'}
            width="100%"
            height="100%"
            viewBox="0 0 16 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <g clipPath="url(#clip0_1034_2)">
                <path
                    d="M0.666626 6.99993C0.666626 6.99993 3.33329 1.25635 7.99996 1.25635C12.6666 1.25635 15.3333 6.99993 15.3333 6.99993C15.3333 6.99993 12.6666 12.7435 7.99996 12.7435C3.33329 12.7435 0.666626 6.99993 0.666626 6.99993Z"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M8 9.15388C9.10457 9.15388 10 8.18957 10 7.00004C10 5.8105 9.10457 4.84619 8 4.84619C6.89543 4.84619 6 5.8105 6 7.00004C6 8.18957 6.89543 9.15388 8 9.15388Z"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M13 1L1.99996 13"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </g>
            <defs>
                <clipPath id="clip0_1034_2">
                    <rect width="16" height="14" fill="white" />
                </clipPath>
            </defs>
        </svg>
    )
}

const LoaderIcon = ({ size, className, color }: { size: number, className: string, color?: string }) => {
    return (
        <svg
            width={size}
            height={size}
            fill='none'
            className={className}
            viewBox="0 0 120 120"
            xmlns="http://www.w3.org/2000/svg">
            <path
                d="M60 10V30"
                stroke="#DDD7FF"
                strokeWidth="12"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M60 90V110"
                stroke="#5337FF"
                strokeWidth="12"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M24.6499 24.65L38.7999 38.8"
                stroke="#211666"
                strokeWidth="12"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M81.2002 81.2L95.3502 95.35"
                stroke="#755FFF"
                strokeWidth="12"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M10 60H30"
                stroke="#322199"
                strokeWidth="12"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M90 60H110"
                stroke="#9887FF"
                strokeWidth="12"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M24.6499 95.35L38.7999 81.2"
                stroke="#422CCC"
                strokeWidth="12"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M81.2002 38.8L95.3502 24.65"
                stroke="#BAAFFF"
                strokeWidth="12"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}

const PinIcon = () => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M19.9942 10.3698C20.024 16.8797 11.5715 22.501 11.5715 22.501C11.5715 22.501 3.06799 16.9625 3.03824 10.4526C3.0281 8.23282 3.91159 6.09954 5.49435 4.52211C7.07711 2.94468 9.22949 2.05232 11.478 2.04133C13.7265 2.03034 15.8869 2.90162 17.484 4.46351C19.0812 6.02539 19.9841 8.14995 19.9942 10.3698Z"
                stroke="currentColor"
                strokeWidth="1.6875"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M11.5292 13.2454C13.09 13.2378 14.3492 11.923 14.3419 10.3088C14.3345 8.69454 13.0633 7.39213 11.5025 7.39976C9.94176 7.40739 8.68249 8.72216 8.68987 10.3364C8.69724 11.9506 9.96847 13.253 11.5292 13.2454Z"
                stroke="currentColor"
                strokeWidth="1.6875"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}

const GlobeIcon = () => {
    return (
        <svg
            width="28"
            height="28"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.4"
                d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
            />
        </svg>
    )
}

const PostIcon = () => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M19 22H5C4.20435 22 3.44129 21.6839 2.87868 21.1213C2.31607 20.5587 2 19.7956 2 19V3C2 2.73478 2.10536 2.48043 2.29289 2.29289C2.48043 2.10536 2.73478 2 3 2H17C17.2652 2 17.5196 2.10536 17.7071 2.29289C17.8946 2.48043 18 2.73478 18 3V15H22V19C22 19.7956 21.6839 20.5587 21.1213 21.1213C20.5587 21.6839 19.7956 22 19 22ZM18 17V19C18 19.2652 18.1054 19.5196 18.2929 19.7071C18.4804 19.8946 18.7348 20 19 20C19.2652 20 19.5196 19.8946 19.7071 19.7071C19.8946 19.5196 20 19.2652 20 19V17H18ZM16 20V4H4V19C4 19.2652 4.10536 19.5196 4.29289 19.7071C4.48043 19.8946 4.73478 20 5 20H16ZM6 7H14V9H6V7ZM6 11H14V13H6V11ZM6 15H11V17H6V15Z"
                fill="currentColor"
            />
        </svg>
    )
}
const CommentIcon = () => {
    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 sm:w-6 sm:h-6"
        >
            <path
                d="M10 3H14C16.1217 3 18.1566 3.84285 19.6569 5.34315C21.1571 6.84344 22 8.87827 22 11C22 13.1217 21.1571 15.1566 19.6569 16.6569C18.1566 18.1571 16.1217 19 14 19V22.5C9 20.5 2 17.5 2 11C2 8.87827 2.84285 6.84344 4.34315 5.34315C5.84344 3.84285 7.87827 3 10 3V3ZM12 17H14C15.5913 17 17.1174 16.3679 18.2426 15.2426C19.3679 14.1174 20 12.5913 20 11C20 9.4087 19.3679 7.88258 18.2426 6.75736C17.1174 5.63214 15.5913 5 14 5H10C8.4087 5 6.88258 5.63214 5.75736 6.75736C4.63214 7.88258 4 9.4087 4 11C4 14.61 6.462 16.966 12 19.48V17Z"
                fill="currentColor"
            />
        </svg>
    )
}

const TagIcon = () => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M7.784 14L8.204 10H4V8H8.415L8.94 3H10.951L10.426 8H14.415L14.94 3H16.951L16.426 8H20V10H16.216L15.796 14H20V16H15.585L15.06 21H13.049L13.574 16H9.585L9.06 21H7.049L7.574 16H4V14H7.784ZM9.795 14H13.785L14.205 10H10.215L9.795 14Z"
                fill="currentColor"
            />
        </svg>
    )
}

const UploadImage = () => {
    return (
        <svg width="40" height="40" viewBox="0 0 58 58" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M50.75 36.25V45.9167C50.75 47.1985 50.2408 48.4279 49.3343 49.3343C48.4279 50.2408 47.1985 50.75 45.9167 50.75H12.0833C10.8015 50.75 9.57208 50.2408 8.66565 49.3343C7.75922 48.4279 7.25 47.1985 7.25 45.9167V36.25"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M41.0834 19.3333L29 7.25L16.9167 19.3333"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M29 7.25V36.25"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}

const UnsupportedIcon = () => {
    return (
        <svg width="46" height="45" viewBox="0 0 96 95" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M51.9583 7.91675H24.2499C22.1503 7.91675 20.1367 8.75082 18.652 10.2355C17.1673 11.7202 16.3333 13.7338 16.3333 15.8335V79.1668C16.3333 81.2664 17.1673 83.28 18.652 84.7647C20.1367 86.2494 22.1503 87.0835 24.2499 87.0835H71.7499C73.8496 87.0835 75.8632 86.2494 77.3478 84.7647C78.8325 83.28 79.6666 81.2664 79.6666 79.1668V35.6251L51.9583 7.91675Z"
                stroke="currentColor"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M51.9583 7.91675V35.6251H79.6666"
                stroke="currentColor"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M43.5 48H16.5C12.0817 48 8.5 51.5817 8.5 56V71C8.5 75.4183 12.0817 79 16.5 79H43.5C47.9183 79 51.5 75.4183 51.5 71V56C51.5 51.5817 47.9183 48 43.5 48Z"
                fill="#5337FF"
            />
            <path
                d="M28.7784 66.7244V66.5398C28.7831 65.6828 28.8636 65.0009 29.0199 64.4943C29.1809 63.9877 29.4081 63.5805 29.7017 63.2727C29.9953 62.9602 30.3527 62.6738 30.7741 62.4134C31.063 62.2334 31.321 62.0369 31.5483 61.8239C31.7803 61.6061 31.9626 61.3646 32.0952 61.0994C32.2277 60.8295 32.294 60.5289 32.294 60.1974C32.294 59.8234 32.2064 59.4991 32.0312 59.2244C31.8561 58.9498 31.6193 58.7367 31.321 58.5852C31.0275 58.4337 30.6984 58.358 30.3338 58.358C29.9976 58.358 29.678 58.4313 29.375 58.5781C29.0767 58.7202 28.8281 58.938 28.6293 59.2315C28.4351 59.5204 28.3262 59.8873 28.3026 60.3324H25.7741C25.7978 59.4328 26.0156 58.6799 26.4276 58.0739C26.8442 57.4678 27.3935 57.0133 28.0753 56.7102C28.7618 56.4072 29.5194 56.2557 30.348 56.2557C31.2524 56.2557 32.0478 56.4143 32.7344 56.7315C33.4257 57.0488 33.9631 57.5009 34.3466 58.0881C34.7348 58.6705 34.929 59.3617 34.929 60.1619C34.929 60.7017 34.8414 61.1847 34.6662 61.6108C34.4957 62.0369 34.2519 62.4157 33.9347 62.7472C33.6174 63.0786 33.241 63.3745 32.8054 63.6349C32.4219 63.8717 32.107 64.1179 31.8608 64.3736C31.6193 64.6293 31.4394 64.9299 31.321 65.2756C31.2074 65.6165 31.1482 66.0379 31.1435 66.5398V66.7244H28.7784ZM30.0142 71.1562C29.5881 71.1562 29.2211 71.0047 28.9134 70.7017C28.6056 70.3987 28.4517 70.0294 28.4517 69.5938C28.4517 69.1676 28.6056 68.803 28.9134 68.5C29.2211 68.197 29.5881 68.0455 30.0142 68.0455C30.4356 68.0455 30.8002 68.197 31.108 68.5C31.4205 68.803 31.5767 69.1676 31.5767 69.5938C31.5767 69.8826 31.5033 70.1454 31.3565 70.3821C31.2145 70.6188 31.0251 70.8082 30.7884 70.9503C30.5563 71.0876 30.2983 71.1562 30.0142 71.1562Z"
                fill="white"
            />
        </svg>
    )
}


const CloseUploadIcon = () => {
    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="cursor-pointer"
        >
            <path
                d="M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}


const CloseIcon = () => {
    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="cursor-pointer"
        >
            <path
                d="M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}

const SettingsIcon = () => {
    return (
        <svg
            width="24"
            height="25"
            viewBox="0 0 24 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
        >
            <path
                d="M22.973 15.4188L20.976 14.2657C21.1776 13.1782 21.1776 12.0625 20.976 10.975L22.973 9.82192C23.2026 9.69067 23.3057 9.41879 23.2307 9.16567C22.7105 7.49692 21.8244 5.98754 20.6667 4.73129C20.4885 4.53911 20.198 4.49224 19.973 4.62349L17.976 5.77661C17.1369 5.05474 16.1714 4.49692 15.126 4.13129V1.82973C15.126 1.56723 14.9432 1.33754 14.6854 1.28129C12.9651 0.896919 11.2026 0.915669 9.56669 1.28129C9.30887 1.33754 9.12607 1.56723 9.12607 1.82973V4.13599C8.08544 4.50629 7.11982 5.06411 6.27607 5.78129L4.28387 4.62817C4.05419 4.49692 3.76825 4.53911 3.59012 4.73599C2.43232 5.98754 1.54638 7.49692 1.02607 9.17036C0.946381 9.42349 1.05419 9.69536 1.28388 9.82661L3.28075 10.9797C3.07919 12.0672 3.07919 13.1829 3.28075 14.2704L1.28388 15.4235C1.05419 15.5547 0.951068 15.8267 1.02607 16.0797C1.54638 17.7485 2.43232 19.2579 3.59012 20.5142C3.76825 20.7063 4.05887 20.7531 4.28387 20.6219L6.28075 19.4688C7.11982 20.1906 8.08544 20.7485 9.13075 21.1142V23.4204C9.13075 23.6829 9.31357 23.9126 9.57137 23.9688C11.2917 24.3531 13.0542 24.3344 14.6901 23.9688C14.9479 23.9126 15.1307 23.6829 15.1307 23.4204V21.1142C16.1714 20.7438 17.1369 20.186 17.9807 19.4688L19.9776 20.6219C20.2073 20.7531 20.4932 20.711 20.6714 20.5142C21.8292 19.2626 22.7151 17.7531 23.2355 16.0797C23.3057 15.8219 23.2026 15.55 22.973 15.4188ZM12.1261 16.3704C10.0589 16.3704 8.37607 14.6875 8.37607 12.6204C8.37607 10.5532 10.0589 8.87036 12.1261 8.87036C14.1932 8.87036 15.876 10.5532 15.876 12.6204C15.876 14.6875 14.1932 16.3704 12.1261 16.3704Z"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinejoin="round"
            />
        </svg>
    )
}

const ConfirmIcon = () => {
    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
        >
            <path
                d="M15.9104 2.848C15.7682 2.31583 15.4655 1.84734 15.0485 1.51377C14.6315 1.1802 14.1229 0.999796 13.6 1H10.4C9.30133 1 8.37333 1.78185 8.0896 2.848M15.9104 2.848C15.9691 3.06687 16 3.29928 16 3.53846C16 3.76288 15.9157 3.9781 15.7657 4.13678C15.6157 4.29547 15.4122 4.38462 15.2 4.38462H8.8C8.58783 4.38462 8.38434 4.29547 8.23432 4.13678C8.08429 3.9781 8 3.76288 8 3.53846C8 3.29928 8.032 3.06687 8.0896 2.848M15.9104 2.848C16.5995 2.90328 17.2843 2.9721 17.9659 3.05559C19.1392 3.2 20 4.27067 20 5.52072V20.4615C20 21.1348 19.7471 21.7804 19.2971 22.2565C18.847 22.7326 18.2365 23 17.6 23H6.4C5.76348 23 5.15303 22.7326 4.70294 22.2565C4.25286 21.7804 4 21.1348 4 20.4615V5.52072C4 4.27067 4.85973 3.2 6.03413 3.05559C6.71791 2.97185 7.4032 2.90264 8.0896 2.848"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M8 14L11 17L16 10"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}

const HeartIcon = () => {
    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 sm:w-6 sm:h-6"
        >
            <path
                d="M20.4855 12.8085L12.0001 21.2929L3.35066 12.6435L3.20065 12.4685C2.32318 11.4452 1.81585 10.1563 1.76044 8.80945C1.70504 7.4626 2.10478 6.13634 2.89523 5.04444C3.68568 3.95254 4.8208 3.15863 6.11759 2.79068C6.70144 2.62501 7.73313 2.65356 8.78654 2.92346C9.58223 3.12733 10.31 3.44852 10.8227 3.85373L11.2707 4.30179L11.5996 4.72366L11.9997 4.32358C13.1248 3.19828 14.651 2.566 16.2423 2.56592C17.8336 2.56583 19.3598 3.1979 20.4851 4.32307C21.6104 5.44824 22.2426 6.97435 22.2427 8.56567C22.2428 10.157 21.6107 11.6831 20.4856 12.8084C20.4855 12.8084 20.4855 12.8084 20.4855 12.8085Z"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="1.4"
            />
        </svg>
    )
}

const EmptyHeartIcon = () => {
    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 sm:w-6 sm:h-6"
        >
            <path d="M4.31804 6.31804C3.90017 6.7359 3.5687 7.23198 3.34255 7.77795C3.1164 8.32392 3 8.90909 3 9.50004C3 10.091 3.1164 10.6762 3.34255 11.2221C3.5687 11.7681 3.90017 12.2642 4.31804 12.682L12 20.364L19.682 12.682C20.526 11.8381 21.0001 10.6935 21.0001 9.50004C21.0001 8.30656 20.526 7.16196 19.682 6.31804C18.8381 5.47412 17.6935 5.00001 16.5 5.00001C15.3066 5.00001 14.162 5.47412 13.318 6.31804L12 7.63604L10.682 6.31804C10.2642 5.90017 9.7681 5.5687 9.22213 5.34255C8.67616 5.1164 8.09099 5 7.50004 5C6.90909 5 6.32392 5.1164 5.77795 5.34255C5.23198 5.5687 4.7359 5.90017 4.31804 6.31804Z"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>

    )
}

const ChatIcon = () => {
    return (
        <svg
            width="24"
            height="24"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.4"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
        </svg>
    )
}

const PostTagIcon = ({ isTaged }: { isTaged?: boolean }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            className="w-5 h-5 sm:w-6 sm:h-6"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.4"
                fill={`${isTaged ? "currentColor" : "transparent"}`}
                d="M5 2h14a1 1 0 011 1v19.143a.5.5 0 01-.766.424L12 18.03l-7.234 4.536A.5.5 0 014 22.143V3a1 1 0 011-1z"
            >
            </path>
        </svg >
    )
}

const OptsIcon = () => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8.25 12C8.25 12.3978 8.09196 12.7794 7.81066 13.0607C7.52936 13.342 7.14782 13.5 6.75 13.5C6.35218 13.5 5.97064 13.342 5.68934 13.0607C5.40804 12.7794 5.25 12.3978 5.25 12C5.25 11.6022 5.40804 11.2206 5.68934 10.9393C5.97064 10.658 6.35218 10.5 6.75 10.5C7.14782 10.5 7.52936 10.658 7.81066 10.9393C8.09196 11.2206 8.25 11.6022 8.25 12ZM13.5 12C13.5 12.3978 13.342 12.7794 13.0607 13.0607C12.7794 13.342 12.3978 13.5 12 13.5C11.6022 13.5 11.2206 13.342 10.9393 13.0607C10.658 12.7794 10.5 12.3978 10.5 12C10.5 11.6022 10.658 11.2206 10.9393 10.9393C11.2206 10.658 11.6022 10.5 12 10.5C12.3978 10.5 12.7794 10.658 13.0607 10.9393C13.342 11.2206 13.5 11.6022 13.5 12ZM17.25 13.5C17.6478 13.5 18.0294 13.342 18.3107 13.0607C18.592 12.7794 18.75 12.3978 18.75 12C18.75 11.6022 18.592 11.2206 18.3107 10.9393C18.0294 10.658 17.6478 10.5 17.25 10.5C16.8522 10.5 16.4706 10.658 16.1893 10.9393C15.908 11.2206 15.75 11.6022 15.75 12C15.75 12.3978 15.908 12.7794 16.1893 13.0607C16.4706 13.342 16.8522 13.5 17.25 13.5Z"
                fill="currentColor"
            />
        </svg>
    )
}

const ScrollToTopIcon = () => {
    return (
        <svg
            width="30"
            height="30"
            viewBox="0 0 28 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="z-50 cursor-pointer text-indigo-500 dark:text-gray-100"
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M14.0001 27.3332C21.3639 27.3332 27.3334 21.3636 27.3334 13.9998C27.3334 6.63604 21.3639 0.666504 14.0001 0.666504C6.63628 0.666504 0.666748 6.63604 0.666748 13.9998C0.666748 21.3636 6.63628 27.3332 14.0001 27.3332ZM14.7072 7.9594L20.0405 13.2927C20.431 13.6832 20.431 14.3164 20.0405 14.7069C19.65 15.0974 19.0168 15.0974 18.6263 14.7069L15 11.0806V19.3332C15 19.8855 14.5523 20.3332 14 20.3332C13.4477 20.3332 13 19.8855 13 19.3332V11.0808L9.37385 14.7069C8.98333 15.0974 8.35016 15.0974 7.95964 14.7069C7.56912 14.3164 7.56912 13.6832 7.95964 13.2927L13.2845 7.96785C13.3175 7.93406 13.3529 7.90259 13.3904 7.87372C13.4454 7.83134 13.5037 7.79546 13.5644 7.76609C13.6961 7.70228 13.8439 7.6665 14 7.6665C14.0008 7.6665 14.0016 7.6665 14.0023 7.66651C14.122 7.66678 14.2368 7.68808 14.3431 7.72691C14.476 7.77532 14.6006 7.85281 14.7072 7.9594Z"
                fill="currentColor"
                fillOpacity="0.84"
            />
        </svg>
    )
}

const CopyLinkIcon = () => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M7 6V3C7 2.73478 7.10536 2.48043 7.29289 2.29289C7.48043 2.10536 7.73478 2 8 2H20C20.2652 2 20.5196 2.10536 20.7071 2.29289C20.8946 2.48043 21 2.73478 21 3V17C21 17.2652 20.8946 17.5196 20.7071 17.7071C20.5196 17.8946 20.2652 18 20 18H17V21C17 21.552 16.55 22 15.993 22H4.007C3.87509 22.0009 3.7443 21.9757 3.62217 21.9259C3.50003 21.8761 3.38896 21.8025 3.29536 21.7096C3.20176 21.6166 3.12748 21.5061 3.07678 21.3843C3.02609 21.2625 3 21.1319 3 21L3.003 7C3.003 6.448 3.453 6 4.01 6H7ZM9 6C9 6 14 6 16 6C16.5523 6 17 6.44772 17 7C17 11 17 16 17 16H19V4H9V6ZM7 9V11H13V9H7ZM7 17V19H13V17H7Z"
                fill="currentColor"
            />
            <path d="M7 13H13V15H7V13Z" fill="currentColor" />
        </svg>
    )
}

const DeleteIcon = () => {
    return (
        <svg width="18" height="20" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_1205_6)">
                <path
                    d="M1 4H2.33333H13"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M11.6667 4.00016V13.3335C11.6667 13.6871 11.5262 14.0263 11.2762 14.2763C11.0261 14.5264 10.687 14.6668 10.3334 14.6668H3.66671C3.31309 14.6668 2.97395 14.5264 2.7239 14.2763C2.47385 14.0263 2.33337 13.6871 2.33337 13.3335V4.00016M4.33337 4.00016V2.66683C4.33337 2.31321 4.47385 1.97407 4.7239 1.72402C4.97395 1.47397 5.31309 1.3335 5.66671 1.3335H8.33337C8.687 1.3335 9.02613 1.47397 9.27618 1.72402C9.52623 1.97407 9.66671 2.31321 9.66671 2.66683V4.00016"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M5.66663 7.3335V11.3335"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M8.33337 7.3335V11.3335"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </g>
            <defs>
                <clipPath id="clip0_1205_6">
                    <rect width="14" height="16" fill="white" />
                </clipPath>
            </defs>
        </svg>
    )
}

const EditIcon = () => {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_1205_17)">
                <path
                    d="M11.3334 2.00004C11.5085 1.82494 11.7163 1.68605 11.9451 1.59129C12.1739 1.49653 12.4191 1.44775 12.6667 1.44775C12.9143 1.44775 13.1595 1.49653 13.3883 1.59129C13.6171 1.68605 13.8249 1.82494 14 2.00004C14.1751 2.17513 14.314 2.383 14.4088 2.61178C14.5036 2.84055 14.5523 3.08575 14.5523 3.33337C14.5523 3.58099 14.5036 3.82619 14.4088 4.05497C14.314 4.28374 14.1751 4.49161 14 4.66671L5.00004 13.6667L1.33337 14.6667L2.33337 11L11.3334 2.00004Z"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </g>
            <defs>
                <clipPath id="clip0_1205_17">
                    <rect width="16" height="16" fill="white" />
                </clipPath>
            </defs>
        </svg>
    )
}

const ReadTimeIcon = () => {
    return (
        <svg
            width="22"
            height="20"
            viewBox="0 0 22 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-4"
        >
            <g clipPath="url(#clip0_1202_9)">
                <path
                    d="M1 1H7C8.06087 1 9.07828 1.42143 9.82843 2.17157C10.5786 2.92172 11 3.93913 11 5V19C11 18.2044 10.6839 17.4413 10.1213 16.8787C9.55871 16.3161 8.79565 16 8 16H1V1Z"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M21 1H15C13.9391 1 12.9217 1.42143 12.1716 2.17157C11.4214 2.92172 11 3.93913 11 5V19C11 18.2044 11.3161 17.4413 11.8787 16.8787C12.4413 16.3161 13.2044 16 14 16H21V1Z"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </g>
            <defs>
                <clipPath id="clip0_1202_9">
                    <rect width="22" height="20" fill="white" />
                </clipPath>
            </defs>
        </svg>
    )
}

const ReplyIcon = () => {
    return (
        <svg
            width="24"
            height="24"
            className="w-5 h-5"
            viewBox="0 0 512 512"
            xmlns="http://www.w3.org/2000/svg"
            stroke="currentColor"
            fill="currentColor"
        >
            <path d="M503.691 189.836L327.687 37.851C312.281 24.546 288 35.347 288 56.015v80.053C127.371 137.907 0 170.1 0 322.326c0 61.441 39.581 122.309 83.333 154.132 13.653 9.931 33.111-2.533 28.077-18.631C66.066 312.814 132.917 274.316 288 272.085V360c0 20.7 24.3 31.453 39.687 18.164l176.004-152c11.071-9.562 11.086-26.753 0-36.328z">
            </path>
        </svg>
    )
}

export { AppIcon, ChatIcon, CloseUploadIcon, CloseIcon, CommentIcon, ConfirmIcon, CopyLinkIcon, DeleteIcon, EditIcon, EmptyHeartIcon, GlobeIcon, HambButton, HeartIcon, HomeIcon, LoaderIcon, NewIcon, HidePassIcon, OptsIcon, PinIcon, PostIcon, PostTagIcon, ReadTimeIcon, ReplyIcon, ScrollToTopIcon, SettingsIcon, ShowPassIcon, TagIcon, UnsupportedIcon, UploadImage }

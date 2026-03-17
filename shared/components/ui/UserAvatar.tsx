// import Image from 'next/image';

// export default function UserAvatar() {
//     return (
//         <div className="min-w-8 max-w-8 overflow-hidden cursor-pointer">
//             <Image
//                 src="/next.svg"
//                 alt="User avatar"
//                 width={40}
//                 height={40}
//                 className=" rounded-full h-full w-auto object-cover bg-indigo-400"
//             />
//         </div>
//     );
// }

import Image from 'next/image';

export default function UserAvatar() {
    return (
        <div className="min-w-8 max-w-8 rounded-full overflow-hidden cursor-pointer flex items-center justify-center bg-indigo-400">
            <Image
                src="/next.svg"
                alt="User avatar"
                width={32}
                height={32}
                className="object-cover"
            />
        </div>
    );
}

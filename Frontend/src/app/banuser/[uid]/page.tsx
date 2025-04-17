import getBannedUsers from "@/libs/getBannedUsers"

export default function BanUserIDPage({params} : {params : {uid : string}}) {
    const userBannedDetail = await getBannedUsers(params.cid);
    return (
        <main>
            <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 min-h-screen py-12 px-4 sm:px-6">
                <div className="container mx-auto max-w-4xl">
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
                        <h1 className="text-3xl font-bold text-white mb-8 text-center">
                            Ban User
                        </h1>
                        <p className="text-white text-center text-lg">
                            User ID: {params.uid}
                        </p>
                    </div>
                </div>
            </div>
        </main>
    )
}
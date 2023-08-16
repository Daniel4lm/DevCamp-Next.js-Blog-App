import { Modal } from '@/components/CoreComponents'
import Link from 'next/link'

function PostsFeedPage() {

    async function onClose() {
        "use server"
        console.log("Modal has closed")
    }

    async function onOk() {
        "use server"
        console.log("Ok was clicked")
    }

    return (
        <>
            <Modal
                title="Example Modal"
                onClose={onClose}
                onConfirmation={onOk}
                type='info'
                style="bg-white dark:bg-slate-600 dark:text-slate-100 w-full md:w-2/3 min-h-[6rem] border rounded-xl flex flex-col mx-auto opacity-100 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            >
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Veniam eligendi odio ipsa nostrum dolores voluptas architecto tempore nulla voluptatibus vel,
                    placeat explicabo exercitationem id officia laborum doloremque blanditiis earum accusamus.
                </p>
            </Modal>
            <div className='mx-4 mt-20'>
                <h1 className="text-3xl">Home</h1>

                <Link href="/" className="text-2xl underline">Go to Home</Link>

                <section className="text-2xl flex flex-col gap-4 p-4">
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Provident error nemo dolores sunt. Natus numquam hic praesentium nihil accusamus quis magni vero, debitis vitae libero. Dignissimos repudiandae necessitatibus modi repellat.</p>
                    <p>Modi laborum nam odio accusantium non eius? Aliquam, inventore suscipit? Quibusdam consequuntur autem voluptates magni, tenetur eos ea aliquid, assumenda, voluptas atque voluptatum iste odit magnam necessitatibus dolorum excepturi odio?</p>
                    <p>Commodi rem debitis quaerat voluptate corporis! Nostrum, magnam fugit! Dolore et odit repudiandae dicta vitae accusantium soluta eum deleniti autem. Dolore nobis reiciendis illo, vero possimus hic laborum quidem sit!</p>
                    <p>Accusamus ipsum quia doloribus. Animi, sapiente fugit dolore fugiat sed, repudiandae labore modi praesentium saepe facere velit aliquam corrupti numquam ullam. Consequuntur quibusdam ad nihil nemo praesentium minima animi cum?</p>
                    <p>Nemo quod saepe nostrum ex quo eveniet voluptatum corrupti quaerat voluptatibus, quisquam eum. Magnam minima soluta, dolores at porro aperiam tenetur ullam quidem consequatur quae repellat eaque, consectetur et tempore.</p>
                    <p>Explicabo voluptates, velit vitae fugiat illo, earum, incidunt molestiae aliquam consequatur ullam inventore voluptas harum. Voluptatum, a, numquam iusto ex dolorum placeat enim, consequatur molestias harum corporis eius aperiam mollitia.</p>
                    <p>Qui repellat inventore sit eius consectetur obcaecati accusantium quaerat velit ut sed architecto dolores, vero beatae tempora libero magni at neque. Similique architecto neque molestiae beatae tenetur numquam eius officiis.</p>
                </section>
            </div>
        </>
    )
}

export default PostsFeedPage

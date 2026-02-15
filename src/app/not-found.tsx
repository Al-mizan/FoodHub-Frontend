import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function NotFound() {
    return (
        <div className='flex flex-col items-center justify-center min-h-screen'>
            <h2 className="text-2xl font-bold">404 Not Found</h2>
            <p className="text-muted-foreground">Could not find requested resource!</p>
            <br />
            <Link href="/">
                <Button variant="default" className='cursor-pointer'>Return Home</Button>
            </Link>
        </div>
    )
}
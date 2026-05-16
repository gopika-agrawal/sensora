import { Show, SignInButton, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import Image from 'next/image';
import { FileText, GraduationCap, LayoutDashboard, PenBox, StarsIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { checkUser } from '@/lib/checkUser';

const Header = async() => {
    await checkUser();
  return (
    <header className='fixed top-0 w-full border-b bg-background/80 backdrop-blur-md z-50 supports-[background-filter]:bg-background/60'>


        <nav className='container mx-auto flex items-center justify-between h-16 px-4'>
            <Link href="/">
                <Image src="/senlogo.png" alt="Logo" width={200} height={60} 
                    className="h-12 py-1 w-auto object-contain"
                />
            </Link>

            <div className="flex items-center space-x-2 md:space-x-4">
                <Show when="signed-in">
                    <Link href="/dashboard">
                        <Button variant="outline">
                            <LayoutDashboard className="h-4 w-4" />
                            <span className="hidden md:block">Industry Insights</span>
                        </Button>
                    </Link>
                

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button>
                                <StarsIcon className="h-4 w-4" />
                                <span className="hidden md:block">Growth Tools</span>
                                <ChevronDown className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem>
                                <Link href={"/resume"} className="flex items-center gap-2">
                                    <FileText className="h-4 w-4" />
                                    <span className="ml-2">Build Resume</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Link href={"/ai-cover-letter"} className="flex items-center gap-2">
                                    <PenBox className="h-4 w-4" />
                                    <span className="ml-2">Cover Letter</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Link href={"/interview"} className="flex items-center gap-2">
                                    <GraduationCap className="h-4 w-4" />
                                    <span className="ml-2">Interview Prep</span>
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                </Show>


                <Show when="signed-out">
                    <SignInButton>
                        <Button variant="outline">Sign In</Button>
                    </SignInButton>
                </Show>
                <Show when="signed-in">
                    <UserButton
                        appearance={{

                            elements: {
                                avatarBox: "w-10 h-10",
                                userButtonPopoverCard: "shadow-xl",
                                userPreviewMainIdentifier: "font-semibold",
                            },
                        }}
                        afterSignOutUrl="/"
                    />
                </Show>
            </div>

        </nav>

        
    </header>
  )
}

export default Header
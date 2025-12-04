export function LandingFooter() {
    return (
        <footer className="py-8 border-t bg-muted/20">
            <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-sm text-muted-foreground">
                    © {new Date().getFullYear()} Trove. All rights reserved.
                </p>
                <div className="flex gap-6 text-sm text-muted-foreground">
                    <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
                    <a href="#" className="hover:text-foreground transition-colors">Terms</a>
                    <a href="#" className="hover:text-foreground transition-colors">Contact</a>
                </div>
            </div>
        </footer>
    )
}

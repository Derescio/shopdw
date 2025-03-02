import { APP_NAME } from "@/lib/constatnts";
const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (<footer className="border-t">
        <div className="p-5 flex-center">
            {APP_NAME} &copy; {currentYear} All rights reserved.
        </div>

    </footer>);
}

export default Footer;
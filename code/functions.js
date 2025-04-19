import {FilterXSS} from "xss";

export function XssSanitizer(camp) {
    if (typeof camp === "string") {
        const sanitizer = new FilterXSS(camp,{
            stripIgnoreTagBody:true,
            stripIgnoreTag:true
        });
        return sanitizer.process(camp);
    };
};
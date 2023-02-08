import mongoose from "mongoose";
import slug from "mongoose-slug-generator";
mongoose.plugin(slug);
const schema = new mongoose.Schema({
    name: {
        type: 'string',
        required: true,
        trim: true,
        unique: true
    },
    rules:{
        type: 'string',
    },
    policy: {
        type: [Object],
        default: [{
                content: "Những nội dung không thuộc phạm trù của danh mục sẽ bị nhắc nhở và xoá (nếu không thay đổi thích hợp)"
            },
            {
                content: "Nghiêm cấm spam, quảng cáo"
            },
            {
                content: "Nghiêm cấm post nội dung 18+ hay những quan điểm cực đoan liên quan tới chính trị - tôn giáo"
            },
            {
                content: "Nghiêm cấm phát ngôn thiếu văn hoá và đả kích cá nhân."
            },
            {
                content: "Nghiêm cấm bài đăng không ghi rõ nguồn nếu đi cóp nhặt"
            },
        ],
    },
    followCount: {
        type: 'Number',
        default: 0
    },
    follow:Boolean,
    attachment:String,
    slug: {
        type: String,
        slug: 'name',
        unique: true
    },
})
 



export const CategoryModel = mongoose.model('Category', schema)
import {connect} from '@/dbConfig/dbConfig'
import User from '@/models/userModel'
import {NextRequest,NextResponse} from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

connect()

export async function POST(request: NextRequest) {

   try {
    const reqBody= await request.json()
   const{email, password} = reqBody
   //validation
   console.log(reqBody);
    
   const user = await User.findOne({email})

   if(!user){
    return NextResponse.json({error: "User does not exists"},{status:400})
   }

   console.log("user exist")

   const valid = await bcrypt.compare(password,user.password)
    
      if(!valid){
        return NextResponse.json({error: "Check your credentials"},{status:400})
      }
      
      const tokenData={
        id:user._id,
        username:user.username,
        email: user.email
      }

      const jwttoken = await jwt.sign(tokenData,process.env.TOKEN_SECRET!,{expiresIn:'1d'})

      const response = NextResponse.json({message:"Logged In Success",success: true},{status:200})

      response.cookies.set("token",jwttoken, {
        httpOnly:true
      })

      return response;

   } catch (error:any) {
    return NextResponse.json({error: error.message},{status:500})
   }  

}
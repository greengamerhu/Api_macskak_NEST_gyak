import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Redirect,
  Render,
  Req,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Query } from '@nestjs/common';
import { CatDto } from './catsDto.dto';
import db from './db';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  index() {
    return { message: 'Ez az oldal nem müködik böngészőből' };
  }


  @Get('/api/cats')
  async getCats() {
    const [rows] : any = await db.execute("SELECT * FROM macskak ORDER BY id ASC")
    return rows;
  } 

  @Get('/api/cats')
  async getCatsOrder(@Param('param') parameter : string, @Query('sort') sort : string)  { // @param-al simán nüködött most meg telibe ignorálja a quary-t
    // if (parameter !== "suly" && parameter !== "id" && parameter !== "szem_szin") {
    //   parameter = "id"
    // }
    console.log(sort)
    const query = `SELECT * FROM macskak ORDER BY ${sort}`;
    const [rows] : any =  await db.execute(query)    
    return sort;
  }


  @Get('/api/cats/:param')
  async getAcat(@Param('param') parameter : string)  {
    const [rows] : any =  await db.execute("SELECT * FROM macskak WHERE id = ?", [parameter])
    return rows[0];
  }

  @Delete('/api/cats/:id')
  async deleteCat(@Param('id') id : string)  {
    const [rows] : any =  await db.execute("DELETE FROM macskak WHERE id = ?", [id])
    return rows[0];
  }

  @Post('/api/cats/')
  async postCat(@Body() catsDto : CatDto) {
    await db.execute("INSERT INTO macskak (suly, szem_szin) VALUES (?, ?)", [catsDto.suly, catsDto.szem_szin] )
    const [rows] :any = await db.execute("SELECT * FROM macskak ORDER BY id DESC LIMIT 1")
    return rows[0];
  }
  
}



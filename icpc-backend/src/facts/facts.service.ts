import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { CreateFactDto } from './dto/create-fact.dto';
import { UpdateFactDto } from './dto/update-fact.dto';

@Injectable()
export class FactsService {
  private facts: string[] = this.loadFacts();

  /*
  Input: None
  Output: string[]
  Return value: Array of facts loaded from file
  Function: Loads facts from a JSON file
  Variables: data
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  private loadFacts() {
    const data = fs.readFileSync('src/facts/facts.json', 'utf8');
    return JSON.parse(data);
  }

  /*
  Input: None
  Output: void
  Return value: None
  Function: Saves facts to a JSON file
  Variables: None
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  private saveFacts() {
    fs.writeFileSync(
      'src/facts/facts.json',
      JSON.stringify(this.facts, null, 2),
      'utf8'
    );
  }

  /*
  Input: None
  Output: string
  Return value: A random fact
  Function: Returns a random fact from the list
  Variables: index, fact
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  findRandomOne() {
    const index = Math.floor(Math.random() * this.facts.length);
    const fact = this.facts[index];
    return fact;
  }

  /*
  Input: id: number
  Output: string
  Return value: Fact at the given index
  Function: Returns a fact by its index
  Variables: None
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  findOne(id: number) {
    return this.facts[id];
  }

  /*
  Input: createFactDto: CreateFactDto
  Output: string
  Return value: The created fact text
  Function: Adds a new fact and saves it
  Variables: None
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  create(createFactDto: CreateFactDto) {
    this.facts.push(createFactDto.text);
    this.saveFacts();
    return createFactDto.text;
  }

  /*
  Input: id: number, updateFactDto: UpdateFactDto
  Output: string
  Return value: The updated fact text
  Function: Updates a fact at the given index and saves it
  Variables: None
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  update(id: number, updateFactDto: UpdateFactDto) {
    this.facts[id] = updateFactDto.text;
    this.saveFacts();
    return this.facts[id];
  }

  /*
  Input: id: number
  Output: { message: string }
  Return value: Success message
  Function: Removes a fact by its index and saves the list
  Variables: value
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  remove(id: number) {
    const value = this.facts[id];
    this.facts = this.facts.filter(val => val != value);
    this.saveFacts();
    return { message: 'Fact deleted successfully' };
  }
}

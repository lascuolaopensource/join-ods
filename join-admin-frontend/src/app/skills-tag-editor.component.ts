import {AfterViewInit, Component, Input} from "@angular/core";
import {AdminSkillsService} from "./skills/admin-skills.service";
import {Skill} from "@sos/sos-ui-shared";
import {isNumeric} from "rxjs/util/isNumeric";

declare const $: any;


export type SearchSkill = { id: number, name: string };

@Component({
  selector: 'sos-admin-skills-tag-editor',
  template: `
    <input class="form-control form-control-sm" id="search-skill">
  `
})
export class SkillsTagEditorComponent implements AfterViewInit {

  @Input() skills: SearchSkill[];

  private foundSkills: { [name: string]: Skill } = {};

  constructor(private skillsService: AdminSkillsService) {}

  ngAfterViewInit(): void {
    // noinspection JSUnusedGlobalSymbols
    $('#search-skill').tagEditor({
      delimiter: ',,',
      initialTags: [],
      autocomplete: {
        delay: 200,
        source: (req, res) => {
          if (!req.term || req.term.length < 3)
            res([]);
          else
            this.skillsService.search(req.term).subscribe(skills => {
              skills.forEach(skill => {
                this.foundSkills[skill.name] = skill;
              });
              res(skills.map(s => s.name));
            });
        }
      },
      beforeTagSave: (field, editor, tags, tag, val) => {
        if (tag)
          this.removeSkillFromSearch(tag);
        let fs = this.foundSkills[val];
        if (fs)
          this.addSkillToSearch(fs);
        else return false;
      },
      beforeTagDelete: (field, editor, tags, tag, val) => {
        this.removeSkillFromSearch(val);
      }
    });
  }

  private addSkillToSearch(skill: Skill) {
    if (this.skills.find(s => s.id === skill.id))
      return;
    this.skills.push({ id: skill.id, name: skill.name });
  }

  private removeSkillFromSearch(idx: number | string) {
    if (!isNumeric(idx))
      idx = this.skills.map(s => s.name).indexOf(idx);
    this.skills.splice(idx, 1);
  }

}

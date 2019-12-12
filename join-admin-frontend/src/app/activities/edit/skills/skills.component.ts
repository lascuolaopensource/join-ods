import {AfterViewInit, Component, Input, OnDestroy} from "@angular/core";
import {Skill} from "@sos/sos-ui-shared";
import {AdminSkillsService} from "../../../skills/admin-skills.service";


declare const $: any;


@Component({
  selector: 'sos-admin-activity-skills',
  templateUrl: './skills.component.html'
})
export class ActivitySkillsComponent implements AfterViewInit, OnDestroy {

  @Input() labelText: string;
  @Input() skills: Skill[];
  @Input() editing: boolean = false;
  @Input() searchId: string;
  @Input() required: boolean = false;

  public isInvalid: boolean = false;

  private foundSkills: { [name: string]: Skill } = {};

  constructor(private skillsService: AdminSkillsService) {}

  private updateIsInvalid(): void {
    if (this.required) {
      this.isInvalid = this.skills.filter(s => !s['delete']).length < 1;
    }
  }

  ngAfterViewInit(): void {
    this.updateIsInvalid();

    $(`#${this.searchId}`).tagEditor({
      initialTags: this.skills.map(s => s.name),
      autocomplete: {
        delay: 300,
        minLength: 3,
        source: (req, res) => {
          this.skillsService.search(req.term, true).subscribe(skills => {
            const names = [];
            for (let i = 0; i < skills.length; i++) {
              const skill = skills[i];
              names.push(skill.name);
              this.foundSkills[skill.name] = skill;
            }
            res(names);
          });
        }
      },
      beforeTagSave: (field, editor, tags, tag, val) => {
        if (tag)
          this.removeSkill(tag);
        const ret = this.addSkill(val);
        this.updateIsInvalid();
        return ret;
      },
      beforeTagDelete: (field, editor, tags, val) => {
        this.removeSkill(val);
        this.updateIsInvalid();
      }
    });
  }

  ngOnDestroy(): void {
    $(`#${this.searchId}`).tagEditor('destroy');
  }

  addSkill(skill: string): boolean|void {
    if (this.skills.find(s => s.name === skill))
      return false;

    const found = this.foundSkills[skill];
    if (found) {
      this.skills.push(found);
    } else {
      this.skills.push(new Skill(0, skill));
    }
  }

  removeSkill(skill: string): void {
    const index = this.skills.findIndex(s => s.name === skill);
    if (index === -1)
      return;
    if (this.editing && this.skills[index].id !== 0) {
      this.skills[index]['delete'] = true;
    } else {
      this.skills.splice(index, 1);
    }
  }

}

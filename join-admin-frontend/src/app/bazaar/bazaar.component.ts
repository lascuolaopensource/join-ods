import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {BazaarIdeaSlim} from "@sos/sos-ui-shared";
import {changeSorting, sortEntities, Sorting} from "../tables";
import {SearchSkill} from "../skills-tag-editor.component";


@Component({
  selector: 'sos-admin-bazaar',
  templateUrl: './bazaar.component.html',
  styleUrls: ['./bazaar.component.scss']
})
export class BazaarComponent implements OnInit {

  public ideas: BazaarIdeaSlim[];
  public filtered: BazaarIdeaSlim[];

  public sorting: Sorting = { prop: 'createdAt', display: 'data creazione', direction: 'desc' };
  public filtering: { search: string, skills: SearchSkill[] } = { search: '', skills: [] };

  constructor(private route: ActivatedRoute,
              private router: Router) {}

  ngOnInit() {
    this.route.data.subscribe((data: { bazaarIdeas: BazaarIdeaSlim[] }) => {
      this.ideas = data.bazaarIdeas.map(idea => {
        idea['fullName'] = `${idea.creator.firstName} ${idea.creator.lastName}`;
        return idea;
      });
      this.filtered = [...this.ideas];
    });
  }

  changeSorting(prop: string, display: string) {
    this.sorting = changeSorting(prop, display, this.sorting);
    this.filtered = sortEntities(this.filtered, this.sorting);
  }

  private ideaMatchesTitle(idea: BazaarIdeaSlim): boolean {
    return idea.title.toLowerCase().indexOf(this.filtering.search) !== -1;
  }

  private ideaMatchesCreator(idea: BazaarIdeaSlim): boolean {
    const creator = `${idea.creator.firstName} ${idea.creator.lastName}`.toLowerCase();
    return creator.indexOf(this.filtering.search) !== -1;
  }

  private ideaMatchesSkills(idea: BazaarIdeaSlim): boolean {
    if (!idea.skills) return false;
    const filterSkillsLen = this.filtering.skills.length;
    if (filterSkillsLen === 0) return true;
    let ideaSkills = {};
    for (let i = 0; i < idea.skills.length; i++) {
      ideaSkills[idea.skills[i].id] = true;
    }
    for (let i = 0; i < filterSkillsLen; i++) {
      if (!ideaSkills[this.filtering.skills[i].id])
        return false;
    }
    return true;
  }

  changeFilter() {
    if (this.filtering.search)
      this.filtering.search = this.filtering.search.toLowerCase();

    const f = this.ideas.filter(idea => {
      return this.ideaMatchesSkills(idea) && (
        this.ideaMatchesTitle(idea) || this.ideaMatchesCreator(idea));
    });
    this.filtered = sortEntities(f, this.sorting);
  }

  openIdea(idea: BazaarIdeaSlim) {
    // noinspection JSIgnoredPromiseFromCall
    this.router.navigate([idea.ideaType, idea.id], { relativeTo: this.route });
  }

  openActivity(event: Event, idea: BazaarIdeaSlim) {
    event.stopPropagation();
    const commands = idea.activityId == null ?
      ['/activities/new', idea.ideaType, idea.id] :
      ['/activities', idea.ideaType === 'learn' ? 'teach' : idea.ideaType, idea.activityId, 'edit'];
    // noinspection JSIgnoredPromiseFromCall
    this.router.navigate(commands, { queryParamsHandling: 'preserve' });
  }

  deletedIdea(idea: BazaarIdeaSlim, idx: number) {
    this.filtered.splice(idx, 1);
    const sourceIdx = this.ideas.findIndex(i =>
      i.id === idea.id && i.ideaType === idea.ideaType);
    if (sourceIdx !== -1)
      this.ideas.splice(sourceIdx, 1);
  }

}

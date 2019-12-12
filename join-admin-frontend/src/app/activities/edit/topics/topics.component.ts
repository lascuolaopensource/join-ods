import {AfterViewInit, Component, Input, OnDestroy} from "@angular/core";
import {Topic, TopicsService} from "@sos/sos-ui-shared";


declare const $: any;


@Component({
  selector: 'sos-admin-activity-topics',
  templateUrl: './topics.component.html'
})
export class ActivityTopicsComponent implements AfterViewInit, OnDestroy {

  @Input() topics: Topic[];
  @Input() editing: boolean = false;

  private foundTopics: { [name: string]: Topic } = {};

  constructor(private topicsService: TopicsService) {}

  ngAfterViewInit(): void {
    $('#topic-search').tagEditor({
      initialTags: this.topics.map(t => t.topic),
      autocomplete: {
        delay: 300,
        minLength: 3,
        source: (req, res) => {
          this.topicsService.search(req.term).subscribe(topics => {
            const names = [];
            for (let i = 0; i < topics.length; i++) {
              const topic = topics[i];
              names.push(topic.topic);
              this.foundTopics[topic.topic] = topic;
            }
            res(names);
          });
        }
      },
      beforeTagSave: (field, editor, tags, tag, val) => {
        if (tag)
          this.removeTopic(tag);
        return this.addTopic(val);
      },
      beforeTagDelete: (field, editor, tags, val) => {
        this.removeTopic(val);
      }
    });
  }

  ngOnDestroy(): void {
    $('#topic-search').tagEditor('destroy');
  }

  addTopic(topic: string): boolean|void {
    if (this.topics.find(t => t.topic === topic))
      return false;

    const found = this.foundTopics[topic];
    if (found)
      this.topics.push(found);
    else
      this.topics.push(new Topic(0, topic));
  }

  removeTopic(topic: string): void {
    const index = this.topics.findIndex(t => t.topic === topic);
    if (index === -1)
      return;

    if (this.editing && this.topics[index].id !== 0) {
      this.topics[index]['delete'] = true;
    } else {
      this.topics.splice(index, 1);
    }
  }

}

import { ActorId, IDocumentation, IDocumentationSummary } from 'types';
import { Op, WhereOptions } from 'sequelize';
import { injectable } from 'inversify';
import { IDocumentationRepo, IGetDocumentationInput } from '../../app/repos';
import { DocumentationModel } from '../../../../infra/database/sequelize/models';
import sequelize from '../../../../infra/database/sequelize';

@injectable()
export class DocumentationRepo implements IDocumentationRepo {
  public async get(filter: IGetDocumentationInput): Promise<IDocumentation[]> {
    const { districtId, endDate, serviceTypeGroupId, serviceTypeId, startDate, studentId, therapistId } = filter;

    if (districtId !== undefined) {
      const whereClause: WhereOptions<IDocumentation> = {
        billingDistrictId: districtId,
        studentId: {
          [Op.is]: null,
        },
      };

      if (startDate && endDate) {
        whereClause.serviceDate = {
          [Op.between]: [ startDate, endDate ],
        };
      }

      const include = [
        {
          association: `serviceType`,
          ...(serviceTypeGroupId && {
            required: true,
            where: { serviceTypeGroupId },
          }),
        },
        `billingDistrict`,
        `creator`,
        `therapist`,
      ];

      const notes = await DocumentationModel.findAll({
        include,
        limit: 10,
        order: [[ `createdAt`, `DESC` ]],
        where: whereClause,
      });

      return notes.map((note) => note.get({ plain: true }));
    }

    const notes = await DocumentationModel.findAll({
      include: [
        `billingDistrict`,
        `creator`,
        `student`,
        `serviceType`,
        `therapist`,
      ],
      limit: 10,
      order: [[ `createdAt`, `DESC` ]],
      where: {
        ...!!studentId && { studentId },
        ...!!serviceTypeId && { serviceTypeId },
        ...!!therapistId && { therapistId },
      },
    });

    return notes.map((note) => note.get({ plain: true }));
  }

  public async upsert(note: IDocumentation, actorId: ActorId): Promise<IDocumentation> {
    const [ record ] = await DocumentationModel.upsert(note, { actorId, returning: true, validate: false });

    return record.get({ plain: true });
  }

  public async getById(id: string): Promise<IDocumentation | null> {
    const note = await DocumentationModel.findByPk(id);

    return note ? note.get({ plain: true }) : null;
  }

  public async submit(note: IDocumentation, actorId: ActorId): Promise<IDocumentation> {
    await DocumentationModel.update(note, {
      actorId,
      returning: true,
      validate: true,
      where: { id: note.id },
    });

    const updatedNote = await DocumentationModel.findByPk(note.id);

    return updatedNote ? updatedNote.get({ plain: true }) : null;
  }

  public async getMinuteTotals(serviceTypeGroupCode: string, startDate: Date):
  Promise<IDocumentationSummary> {
    const result = await DocumentationModel.findOne({
      attributes: [
        [ sequelize.fn(`sum`, sequelize.col(`direct_minutes`)), `directMinutes` ],
        [ sequelize.fn(`sum`,
          sequelize.col(`indirect_minutes`)), `indirectMinutes` ],
        [ sequelize.fn(`sum`, sequelize.col(`travel_minutes`)), `travelMinutes` ],
      ],
      include: [
        {
          association: `serviceType`,
          attributes: [],
          include: [
            {
              association: `serviceTypeGroup`,
              attributes: [],
              required: true,
              where: { code: serviceTypeGroupCode },
            },
          ],
          required: true,
        },
      ],
      raw: true,
      where: { createdAt: { [Op.gte]: startDate } },
    });

    return result;
  }
}
